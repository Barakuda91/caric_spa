(function(){
    "use strict";
    var controllerName = 'AdvertController';
    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service','$log','Upload','$timeout']
    function AdvertController ($scope,$routeParams,$rootScope,Service,$log,Upload,$timeout) {
        $log.debug('GET '+controllerName);

        $scope.showParamsBlock = function(){
            console.log('_____________________')
            $scope.showParamsBlockClass = 'show';
        };

        var advert_setting = {};
        io.socket.post('/api/post/create', function (resData) {
            if(resData.status) {
                console.log('ID____', resData)

                advert_setting.post_id = resData.data.post_id
            } else {
                alert('create new id error')
            }
        })



        $scope.deleteImage = function(files, file) {
            console.log(files, file);
            delete files[file]
            console.log(files, file);
        };

        // $scope.upload2 = function(new_files, invalid) {
        //     console.log(new_files, invalid)
        // }


        $scope.uploads = [];
        var uploadArray = {};
        var filesCount = 0;
        var uploadStatus = false;


        $scope.upload = function (files,errorFiles) {
console.log('files upload + ' + files.length)
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    $scope.uploads[$scope.filesCount] = files[i];
                    uploadArray[i] = true;
                    fileUpload(files[i]);
                }
            }
        };

        $scope.$watch('uploads', function(newQ, oldQ){
            console.log(newQ, oldQ);
        })


        function fileUpload(file, count) {
            if (advert_setting.post_id) {
                Upload.upload({
                    url: '/api/post/update_photo',
                    data: { image: file},
                    headers: {'post_id': advert_setting.post_id}
                }).then(function (resp) {
                    //console.log('Success uploaded. Response: ', resp.data);

                    console.log($scope.uploads,56)
                    $scope.filesCount++;
                }, function (resp) {
                    //console.log('Error status: ' + resp.status);
                    //delete $scope.uploads[count];
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ', $scope.uploads);


                    //$scope.uploads[count].style = progressPercentage + '% ';
                });
            } else {
                console.log(advert_setting)
            }
        }



        // обработчик нажатия кнопки подачи объявления
        $scope.advertSubmit = function() {
            var setting = $scope.setting;
            var advertArray = {};
            var badField = [];
            var showModalError = false;

            /* пройтись по массиву основных параметров, и наполнить массив конкртеного объявления
             * */
            for (var parameter in setting.advertAddSettingParams.general) {
                if(checkOnRequired(parameter, 'general'))
                {
                    advertArray[parameter] = setting.values[parameter];
                    setting.advertAddSettingParams.errorClass[parameter] = '';
                } else {
                    showModalError = true;
                    setting.advertAddSettingParams.errorClass[parameter] = 'required';
                }
            }

            for (var parameter in setting.advertAddSettingParams[setting.values.advertType]) {
                if(checkOnRequired(parameter, setting.values.advertType)) {
                    advertArray[parameter] = setting.values[parameter];
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
            console.log(advertArray)
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
                return;
                io.socket.post('/api/post/update', setting.values, function (resData) {
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
        console.log('$routeParams');
        console.log($routeParams);
        /* инфа по обьяве храним в рутскопе если нету тянем из базы */
        if ($routeParams.id) {
            var urlId = $routeParams.id;
            var advertId = urlId.split('-').pop();
            io.socket.post('/api/post/get_one', {id: advertId}, function (resData) {
                console.log('answer');
                console.log(resData.data);
                resData.data.title = Service.createAdvertTitleByType(resData.data);
                resData.data.description = 'Зарядное устройство для электромобиля Nissan Leaf.\n' +
                    '\n' +
                    'Наш интернет-магазин представляет Вашему вниманию Новые качественные зарядные устройства с разъемом J1772.\n' +
                    '\n' +
                    'Данное зарядное устройство предназначено для заряда электромобиля Nissan Leaf.\n' +
                    '\n' +
                    'Так же это устройство совместимо со следующими моделями электромобилей: BMW i3, Smart, Tesla (со специальным переходником), Nissan Leaf, Ford Focus Electric, Ford Fusion Energi, Сhevrolet Volt.\n' +
                    '\n' +
                    'Время полного заряда данным устройством: Nissan Leaf – 6 часов (проверено на собственном автомобиле).\n' +
                    '\n' +
                    'Преимущества Нашего оригинального зарядного устройства для Nissan Leaf:\n' +
                    '\n' +
                    '- Заряжает эффективней штатного зарядного устройства(в штатном 13А, в нашем устройстве 16А);\n' +
                    '\n' +
                    '-Применяемые в устройстве материалы соответствуют современным ГОСТам;\n' +
                    '\n' +
                    '- Медные кабели сечением 2,5 квадрата;\n' +
                    '\n' +
                    '-Кабель от известного испанского производителя Topcabel xtrem ( h07rn-f). Отлично себя зарекомендовал при работе в сложных погодных условиях. (Резкие перепады температур, низкие и высокие температуры, сильные осадки).\n' +
                    '\n' +
                    '- Вилка ip44 позволяет безопасно заряжать автомобиль в любую погоду (дождь, снег и пр.);\n' +
                    '\n' +
                    '- Имеет защитную схему от повышенного напряжения и короткого замыкания;\n' +
                    '\n' +
                    '- Электроника надежна спрятана в рукоятке (дополнительная защита от осадков);\n' +
                    '\n' +
                    '- Длина кабеля составляет 7 м (вместо 5м - штатного);\n' +
                    '\n' +
                    '- Возможность переключения тока с 16А до 10А в случае нестабильной и слабой сети;\n' +
                    '\n' +
                    '- Присутствует полноценная жила защитного заземления;\n' +
                    '\n' +
                    '- Так же если в Вашей сети отсутствует заземление с нашим устройством Вы можете безопасно заряжать свой электроавтомобиль;\n' +
                    '\n' +
                    'Предостерегаем Вас от покупки «восстановленных», «переделанных», «б/у» девайсов для зарядки автомобилей это иногда опасно как для Вашего автомобиля, так и Вашей жизни.\n' +
                    '\n' +
                    'Наши устройства специально спроектированы, прошли многочисленные тесты, и большое время в повседневной эксплуатации. На деле доказали свое преимущество и конкурентоспособность с переделками и штатными зарядными устройствами.\n' +
                    '\n' +
                    'На данное устройство дается годовая гарантия и послегарантийное обслуживание.\n' +
                    '\n' +
                    'Технические Характеристики зарядного устройства.\n' +
                    '\n' +
                    'Тип разъёма на стороне автомобиля: J1772\n' +
                    'Возможно изготовление как американского варианта (Type 1 connector, SAE J1772-2009) так и европейского (Type 2 connector)(смотри фото).\n' +
                    'Максимально допустимый ток для разъёма на стороне автомобиля: 32А.\n' +
                    'Тип разъёма на стороне розетки: Schuko.\n' +
                    'Максимально допустимый ток для разъёма на стороне розетки: 16А.\n' +
                    'Рабочее напряжение устройства: ~230В ±5%.\n' +
                    'Защита от превышения напряжения: есть — пороговое значение 300В.\n' +
                    'Контроль наличия защитного заземления: есть — отключаемый.\n' +
                    'Контроль фазировки вилки в розетке: есть — отключаемый.\n' +
                    'Возможность изменения зарядного тока: есть — предварительная предустановка 10А/16А.\n' +
                    'Индикация режима работы: есть — светодиодная многоцветная.\n' +
                    'Тип кабеля: SiHF.\n' +
                    'Количество жил кабеля: 3 — фаза, нулевой провод, провод защитного заземления.\n' +
                    'Сечение жил кабеля: 2.5 мм².\n' +
                    'Степень защиты: IP44.\n' +
                    'Гарантия: 12 месяцев.\n' +
                    'Товар доставляется Новой почтой.\n' +
                    'Также у жителей г. Одесса, есть возможность забрать заказ с адреса: г. Одесса, ул. Ак. Филатова, 70/1. ';
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