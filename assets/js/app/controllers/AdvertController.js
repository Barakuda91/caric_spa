(function(){
    "use strict";
    var controllerName = 'AdvertController';
    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$route','$rootScope','Service','$log','Upload','$timeout']
    function AdvertController ($scope,$routeParams,$route,$rootScope,Service,$log,Upload,$timeout) {
        $log.debug('GET '+controllerName);
        switch($route.current.$$route.originalPath) {
            // страница подачи объявления
            case '/post/add/':
                $scope.advertAddingInProgress = true;
                $scope.uploadClass = [];
                $scope.uploadStyle = [];

                var uploadArray = [];
                var uploadStatusInProgress = false;
                var advert_setting = {};
                var uploadFilesCount = 0;

                window.onbeforeunload = function onbeforeunload(e) {
                    io.socket.post('/api/post/leave', advert_setting, function () {})
                };

                $scope.$on("$destroy", onbeforeunload);

                io.socket.post('/api/post/create', function (resData) {
                    if(resData.status) {
                        advert_setting.post_id = resData.data.post_id
                    } else {
                        alert('create new id error')
                    }
                });
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

                                $scope.advertAddingInProgress = false;
                                $scope.advertAddingResultClass = 'green';
                                $scope.advertAddingResultHead = 'ADVERT_ADD_SUCCESS';
                                $scope.advertAddingResultText = 'ADVERT_ADD_SUCCESS_TEXT';
                                $scope.$digest();

                                // Service.modal($rootScope, {
                                //     status: 'success',
                                //     header: 'ADVERT_ADD_SUCCESS',
                                //     okButton: true,
                                //     delay: 3000,
                                //     size: 'sm'
                                // });
                            }
                        })
                    }
                };
                break;
            case '/post/show/:id':
                /* инфа по обьяве храним в рутскопе если нету тянем из базы */
                if ($routeParams.id) {
                    var urlId = $routeParams.id;
                    var advertId = urlId.split('-').pop();
                    io.socket.post('/api/post/get_one', {id: advertId}, function (resData) {
                        resData.data.title = Service.createAdvertTitleByType(resData.data);
                        resData.data.informationBlock = resData.data.id + ' ' + resData.data.advertType + ' ' + resData.data.createdAt;

                        var advertDescriptionFormatted = resData.data.advertDescription;
                        if (advertDescriptionFormatted && advertDescriptionFormatted.length > 750) {
                            advertDescriptionFormatted = resData.data.advertDescription.substr(0, 750) + '...';
                        }
                        resData.data.advertDescriptionFormatted = advertDescriptionFormatted;
                        $scope.advertInfo = resData.data;

                        /* авто выравнивание фотки по высоте для 1200 и больше екранов */
                        var originData = {
                            src: '/images/test-advert-foto/2560x1600_2.jpg',
                            w: 2560, h: 1600, index: 0
                        };
                        Service.allignImageInBlock($rootScope.windowWidth, originData);
                        if (resData.data.files && resData.data.files.length) {
                            $scope.slides = [];
                            for (var position in resData.data.files) {
                                var tempObj = {
                                    src: '/image_'
                                        + advertId
                                        + '_'
                                        + position
                                        + '_'
                                        + resData.data.files[position].width
                                        + '_'
                                        + resData.data.files[position].height
                                        + '_'
                                        + urlId
                                        + '.jpg',
                                    w: resData.data.files[position].width,
                                    h: resData.data.files[position].height,
                                    index: position
                                };
                                $scope.slides.push(tempObj)
                            };
                            $scope.slidesCount = $scope.slides.length;
                        } else {
                            $scope.slidesCount = 0;
                            /* заглушка для картинок когда их нет в обьяве */
                            $scope.noImageDefaultSrc = '/images/default.jpg';
                        }
                    });


                    /* массив флагов типа открыть закрыть с дефалтными значениями */
                    $scope.clickElements = {
                        a_show_all_desc_link: true
                    };
                    /* массив параметров страницы типа данных блоков с дефалтными значениями */
                    $scope.mainPageData = {
                        div_class_post_main_wrapper: 0
                    };

                    $scope.showAllDescription = function () {
                        if ($scope.clickElements.a_show_all_desc_link) {
                            /* 30 - 2 padding x 15 */
                            var width = angular.element('.post-description-block-big-screen').closest('div.row').width() - 30;
                            var top = angular.element('.post-description-block-big-screen').offset().top;
                            var left = angular.element('.post-description-block-big-screen').offset().left;
                            var originHeight = angular.element('.popup-description-block').css('height');
                            var addHeight = parseFloat(originHeight) - 500; /* 500 ~ sum height fixed block */
                            $scope.mainPageData.div_class_post_main_wrapper = angular.element('.post-main-wrapper').css('height');
                            if (addHeight >= 0) {
                                var newHeight = parseFloat(angular.element('.post-main-wrapper').css('height')) + addHeight;
                            }
                            angular.element('.post-main-wrapper').css('height', newHeight + 'px');
                            angular.element('.popup-description-block').css('width', width + 'px');
                            angular.element('.popup-description-block').css('top', top + 'px');
                            angular.element('.popup-description-block').css('left', left + 'px');
                            angular.element('.popup-description-block').show('fast');
                            angular.element('a.show-all-desc-link').text($rootScope._.HIDE_ALL);
                            $scope.clickElements.a_show_all_desc_link = false;
                        } else {
                            angular.element('.popup-description-block').hide('fast');
                            angular.element('a.show-all-desc-link').text($rootScope._.SHOW_ALL);
                            angular.element('.post-main-wrapper').css('height', $scope.mainPageData.div_class_post_main_wrapper);
                            $scope.clickElements.a_show_all_desc_link = true;
                        }
                    };

                    /* slider gallery super tru */
                    $scope.opts = {
                        index: 0,
                        history: false
                    };

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
                break;
        }
        /*------------------------------------------------- функции --------------------------------------------------*/
        function checkAndUpload() {
            if(uploadStatusInProgress) return;

            if(uploadArray.length > 0 && uploadArray[uploadFilesCount]) {
                console.log('checkAndUpload начала загрузку файла');
                uploadStatusInProgress = true;
                fileUpload(uploadArray[uploadFilesCount],uploadFilesCount++,
                    function(res){
                        if(res.status) {
                            console.log('checkAndUpload закончила загрузку файла');
                            //$scope.uploadClass[uploadFilesCount-1] = '';
                            $scope.uploadStyle[uploadFilesCount-1] = {
                                'background-size': '100%',
                                'background-image': 'url('+res.data.data.fileUrl+')'
                            }
                            uploadStatusInProgress = false;
                            checkAndUpload();
                        } else {
                            console.error('ошибка сервера при загрузке файла', res.data);
                            $scope.uploadClass[uploadFilesCount-1] = 'error';
                            checkAndUpload();
                        }
                    },
                    function (error){
                        $scope.uploadClass[uploadFilesCount-1] = 'error';
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
                Upload.upload({
                    url: '/api/post/update_photo',
                    data: { image: file},
                    headers: {
                        width: file.$ngfWidth,
                        height: file.$ngfHeight,
                        post_id: advert_setting.post_id,
                        filename: index,
                        token: $rootScope.userData.token
                    }
                }).then(cb,error,progress);
            } else {
                console.log(index)
            }
        }
        /*------------------------------------------------- функции END-----------------------------------------------*/
    }
})();