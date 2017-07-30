(function(){
    "use strict";
    var controllerName = 'AdvertController';
    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service','$log','Upload','$timeout']
    function AdvertController ($scope,$routeParams,$rootScope,Service,$log,Upload,$timeout) {
        $log.debug('GET '+controllerName);

        $scope.uploadClass = []
        $scope.uploadStyle = [];
        var uploadArray = [];
        var uploadStatusInProgress = false;
        var advert_setting = {
            files: 0
        };


        window.onbeforeunload = function onbeforeunload(e) {
            io.socket.post('/api/post/leave', advert_setting, function () {})
        };


        $scope.$on("$destroy", onbeforeunload);

        $scope.showParamsBlock = function(){
            console.log('_____________________')
            $scope.showParamsBlockClass = 'show';
        };

        io.socket.post('/api/post/create', function (resData) {
            if(resData.status) {
                console.log('ID____', resData)

                advert_setting.post_id = resData.data.post_id
            } else {
                alert('create new id error')
            }
        })

        $scope.deleteImage = function(index) {
            console.log(uploadArray[index]);
        };

        $scope.upload = function (files, errorFiles) {
            // загружаем выбраные файлы
            // один или несколько
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    //если текущий файл превысил заданое количесво
                    //возвращаем TODO возвращать ошибку?
                    if(uploadArray.length >= 10) {
                        console.log('uploadArray.lenth more 10', uploadArray.length);
                        checkAndUpload();
                        return;
                    }
                    // наполняем массив
                    uploadArray[uploadArray.length] = files[i];
                }
                checkAndUpload();
            }
        };

        function checkAndUpload() {
            if(uploadStatusInProgress) return;
            console.log('checkAndUpload стартовала', uploadArray, 'advert_setting.files = '+advert_setting.files);

            if(uploadArray.length > 0 && uploadArray[advert_setting.files]) {
                console.log('checkAndUpload начала загрузку файла');
                uploadStatusInProgress = true;
                fileUpload(uploadArray[advert_setting.files],advert_setting.files++,
                    function(res){
                        if(res.status) {
                            console.log('checkAndUpload закончила загрузку файла');
                            //$scope.uploadClass[advert_setting.files-1] = '';
                            $scope.uploadStyle[advert_setting.files-1] = {
                                'background-size': '100%',
                                'background-image': 'url('+res.data.data.fileUrl+')'
                            }
                            uploadStatusInProgress = false;
                            checkAndUpload();
                        } else {
                            console.error('ошибка сервера при загрузке файла', res.data);
                            $scope.uploadClass[advert_setting.files-1] = 'error';
                            checkAndUpload();
                        }
                    },
                    function (error){
                        $scope.uploadClass[advert_setting.files-1] = 'error';
                        console.error('ошибка при загрузке файла', res.data);
                        checkAndUpload();
                    });
            } else {
                console.log('checkAndUpload в процессе. Уходим.');
                uploadStatusInProgress = false;
            }
        }




        function fileUpload(file,index,cb,error,progress) {
            if (advert_setting.post_id) {
                console.log(index)
                Upload.upload({
                    url: '/api/post/update_photo',
                    data: { image: file},
                    headers: {'post_id': advert_setting.post_id, filename: index}
                }).then(cb,error,progress);
            } else {
                console.log(index)
            }
        }

        // обработчик нажатия кнопки подачи объявления
        $scope.advertSubmit = function() {
            var setting = $scope.setting;
            var badField = [];
            var showModalError = false;

            /* пройтись по массиву основных параметров, и наполнить массив конкртеного объявления
             * */
            for (var parameter in setting.advertAddSettingParams.general) {
                if(checkOnRequired(parameter, 'general'))
                {
                    advert_setting[parameter] = setting.values[parameter];
                    setting.advertAddSettingParams.errorClass[parameter] = '';
                } else {
                    showModalError = true;
                    setting.advertAddSettingParams.errorClass[parameter] = 'required';
                }
            }

            for (var parameter in setting.advertAddSettingParams[setting.values.advertType]) {
                if(checkOnRequired(parameter, setting.values.advertType)) {
                    advert_setting[parameter] = setting.values[parameter];
                    setting.advertAddSettingParams.errorClass[parameter] = '';
                } else {
                    showModalError = true;
                    setting.advertAddSettingParams.errorClass[parameter] = 'required';
                }
            }

            function checkOnRequired (parameter, type) {
                if(setting.advertAddSettingParams[type][parameter].required) {
                    var value = setting.values[parameter];
                    if (value === $rootScope.defaultParameterKeyName || typeof value == 'undefined'  || value.length == 0 ) {
                        return false
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }

            if (showModalError) {
                $timeout(function(){
                    angular.element("select.form-control-sm.required").change(function(e){
                            setting.advertAddSettingParams.errorClass = {};
                            $rootScope.$digest();
                        }
                    )},200);

                $rootScope.modal = {
                    errorText: $rootScope._.PLEASE_SELECT_ALL_ELEMENTS
                };

                Service.modal($rootScope, {
                    template: 'error',
                    status: 'error',
                    header: 'MISSING_REQUIRED_PARAMETER',
                    size: 'sm',
                    okButton: true
                });
            } else {
                io.socket.post('/api/post/update', advert_setting, function (resData) {
                    if(resData.status) {
                        setting.values = Service.getDefaultSettingParamsValues(setting.params);
                        Service.modal($rootScope, {
                            status: 'success',
                            header: 'ADVERT_ADD_SUCCESS',
                            okButton: true,
                            delay: 3000,
                            size: 'sm'
                        });
                    }
                })
            }
        }

        /* инфа по обьяве храним в рутскопе если нету тянем из базы */
        if ($routeParams.id) {
            var urlId = $routeParams.id;
            var advertId = urlId.split('-').pop();
            io.socket.post('/api/post/get_one', {id: advertId}, function (resData) {
                console.log('answer');
                console.log(resData.data);
                resData.data.title = Service.createAdvertTitleByType(resData.data);
                resData.data.informationBlock = resData.data.id + ' ' + resData.data.advertType + ' ' + resData.data.createdAt;

                $scope.advertInfo = resData.data;


                /* авто выравнивание фотки по высоте для 1200 и больше екранов */
                var originData = {
                    src: '/images/test-advert-foto/2560x1600_2.jpg',
                    w: 2560, h: 1600, index: 0
                }
                Service.allignImageInBlock($rootScope.windowWidth, originData);
            });

            /* slider gallery super tru */
            $scope.opts = {
                index: 0,
                history: false
            };

            $scope.slides = [
                {
                    src: '/images/test-advert-foto/2560x1600_2.jpg',
                    w: 2560, h: 1600, index: 0
                },
                {
                    src: '/images/test-advert-foto/930x620.jpg',
                    w: 930, h: 620, index: 1
                },
                {
                    src: '/images/test-advert-foto/1000x600.jpg',
                    w: 1000, h: 600, index: 2
                },
                {
                    src: '/images/test-advert-foto/1181x699.jpg',
                    w: 1181, h: 699, index: 3
                },
                {
                    src: '/images/test-advert-foto/1920x1200.jpg',
                    w: 1920, h: 1200, index: 4
                },
                {
                    src: '/images/test-advert-foto/2560x1600.jpg',
                    w: 2560, h: 1600, index: 5
                }
            ];

            $scope.slidesCount = $scope.slides.length;

            // TODO fix fucking shit
            // $scope.$watch(
            //     function(scope) { return scope.opts.index },
            //     function(q,w) {});

            $scope.showGallery = function (i) {

                $scope.opts.index = i;
                //$timeout(function(){ alert(i); $scope.open = true}, 500);
                $scope.open = true
                console.log('$scope.opts.index = ' + $scope.opts.index);
            };

            $scope.closeGallery = function () {
                $scope.open = false;
            };

            $scope.showMainFoto = function (param) {
                /* скрыть все главные фотки и показать переданую */
                angular.element('img.main-image-center').hide();
                angular.element('img.main-image-center').each(function () {
                    if (angular.element(this).data('index') == param) {
                        angular.element(this).show();
                    }
                });
                Service.allignImageInBlock($rootScope.windowWidth);
            };

            /* дефалтное значение рендера */
            $scope.firstRender = true;

            $scope.galleryRotateLeft = function () {
                var currentIndex = angular.element('div.thumbnail-advert-show:first div').data('index');
                $scope.firstRender = false;
                $scope.currentSlides = [];
                var temp1 = [];
                var elemIndex = currentIndex + 1;
                for (var i = 0; i < 6; i++) {
                    if ($scope.slides[elemIndex]) {
                        temp1.push($scope.slides[elemIndex]);
                        elemIndex = elemIndex + 1;
                    }
                }
                var temp2 = [];
                var diff = 6 - temp1.length;
                for (var i = 0; i < diff; i++) {
                    temp2.push($scope.slides[i]);
                }

                $scope.currentSlides = temp1.concat(temp2);
            };

            $scope.galleryRotateRight = function () {
                var currentIndex = angular.element('div.thumbnail-advert-show:last div').data('index');
                $scope.firstRender = false;
                $scope.currentSlides = [];
                var temp1 = [];
                var elemIndex = currentIndex - 1;
                for (var i = 0; i < 6; i++) {
                    if ($scope.slides[elemIndex]) {
                        temp1.push($scope.slides[elemIndex]);
                        elemIndex = elemIndex - 1;
                    }
                }
                temp1.sort(function(a, b) {return a.index -b.index});
                var temp2 = [];
                var diff = 6 - temp1.length;
                var elemIndex = $scope.slides.length - 1;
                for (var i = 0; i < diff; i++) {
                    temp2.push($scope.slides[elemIndex]);
                    elemIndex = elemIndex - 1;
                }
                temp2.sort(function(a, b) {return a.index -b.index});

                $scope.currentSlides = temp2.concat(temp1);
            }


        }

    }
})();