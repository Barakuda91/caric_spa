(function(){
    "use strict";
    var controllerName = 'GeneralController';

    angular.module("General").controller("GeneralController", GeneralController);

    GeneralController.$inject = [
        '$scope',
        '$rootScope',
        'Service',
        '$timeout',
        'md5',
        'localStorageService',
        '$log',
        'Upload'];
    function GeneralController ($scope,$rootScope,Service,$timeout,md5,localStorageService,$log,Upload) {
        $log.debug('GET '+controllerName);

        /*------------------------------------------------- установки ------------------------------------------------*/
        // дефаултный ключ пункта "выберете"
        $rootScope.defaultParameterKeyName = 'def_select';

        // устанавливает объект переводов
        var _ = $rootScope._ = $rootScope._    || Service.getLocalizator($rootScope);

        // объект настроек по умолчанию для модального окна авторизации
        $rootScope.reg_auth = {
            open: false,
            login: {
                open: true
            },
            register: {
                open: false
            },
            forgot: {
                open: false
            },
            success: {
                open: false
            }
        };

        // массив настроек полей при подаче объявления_____________________________________________________
        var advertAddSettingParams = {
            errorClass: {},
            general: {
                advertType: {},
                currency: {},
                priceFor: {},
                quantity: {},
                price: {required: true},
                advertPhoneNumber: {required: true},
                advertDescription: {},
                regions: {required: true},
                city : {required: true}
            },
            wheels: {
                centerHole: {},
                offset: {},
                wheelMaker: {},
                wheelModel: {},
                wheelType:  {required: true},
                wheelWidth: {required: true},
                pcd: {required: true},
                diameter: {required: true},
            },
            tyres: {
                tyreType: {required: true},
                tyreSpeedIndex: {},
                diameter: {required: true},
                tyreLoadIndex: {},
                tyreWidth: {required: true},
                productionYear: {},
                tyreHeight: {required: true},
                treadRest_1: {},
                treadRest_2: {},
                tyreMaker: {},
                tyreModel: {}
            },
            spaces: {
                spacesType: {},
                material: {},
                centerHole: {},
                fastenersType: {},
                spacesWidth: {required: true},
                pcdSpacesFrom: {required: true},
                pcdSpacesTo: {}
            }
        };


        // создаём объект для работы с параметрами
        $rootScope.setting = {
            // вытягиваем список параметров из локалдьной базы
            params: localStorageService.get('settingParameters') || {},
            // устанавливаем массив обязательных полей
            advertAddSettingParams: advertAddSettingParams,
            values: {},
            // кастомные списки выпадающие.
            customSelect: {
                wheelModel: {
                    disabled: true,
                    placeholder: 'SELECT_MAKER'
                },
                tyreModel: {
                    disabled: true,
                    placeholder: 'SELECT_MAKER'
                }
            }
        };

        // установка значений параметров для фильтров, подачи объявлений и т.д__________________________________________
        // TODO перенести эту хуйню в сервисы ДОЛОЙ ЛОГИКУ ИЗ КОНТРОЛЛЕРОВ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log($rootScope.setting,$rootScope.setting.length)
        // если в локальной базе нет параметров - загружаем их
        //if(!$rootScope.setting.params) {
        if (true) {
            // получить список всей макеров
            io.socket.post('/api/params_settings/get', {type: 'MAKERS_ALL'}, function (resData) {
                var params = {
                    tyreMaker: [],
                    wheelMaker: [],
                };
                resData.data.forEach(function(el) {
                    params[el.type+'Maker'].push({
                        key: el.key,
                        title: el.title,
                        models: el.models
                    })
                });
                $rootScope.setting.params = Object.assign({},$rootScope.setting.params,
                    {
                        tyreMaker: Service.getSettingParameter(params.tyreMaker),
                        wheelMaker: Service.getSettingParameter(params.wheelMaker),
                        tyreModel: [],
                        wheelModel: []
                    });
            });
            io.socket.post('/api/params_settings/get', {}, function (resData) {
                if (resData.status) {
                    $rootScope.setting.params = Object.assign({},$rootScope.setting.params,{
                        advertType: Service.getSettingParameter(resData.data.advertType, false),
                        currency: Service.getSettingParameter(resData.data.currency, false),
                        priceFor: Service.getSettingParameter(resData.data.priceFor, false),
                        productionYear: Service.getSettingParameter(resData.data.productionYear),
                        pcd: Service.getSettingParameter(resData.data.pcd),
                        pcdSpacesFrom: Service.getSettingParameter(resData.data.pcd),
                        pcdSpacesTo: Service.getSettingParameter(resData.data.pcd),
                        diameter: Service.getSettingParameter(resData.data.diameter),
                        material: Service.getSettingParameter(resData.data.material),
                        tyreType: Service.getSettingParameter(resData.data.tyreType),
                        tyreHeight: Service.getSettingParameter(resData.data.tyreHeight),
                        tyreWidth: Service.getSettingParameter(resData.data.tyreWidth),
                        tyreSpeedIndex: Service.getSettingParameter(resData.data.tyreSpeedIndex),
                        tyreLoadIndex: Service.getSettingParameter(resData.data.tyreLoadIndex),
                        wheelType: Service.getSettingParameter(resData.data.wheelType),
                        wheelWidth: Service.getSettingParameter(resData.data.wheelWidth),
                        wheelEt: Service.getSettingParameter(resData.data.wheelEt),
                        spacesType: Service.getSettingParameter(resData.data.spacesType),
                        fastenersType: Service.getSettingParameter(resData.data.fastenersType),
                        regions: Service.getSettingParameter(resData.data.regions),
                        deliveryMethod: Service.getSettingParameter(resData.data.deliveryMethod),
                        quantity: Service.getSettingParameter(resData.data.quantity, false),
                        spacesWidth: '',
                        price: '',
                        centerHole: '',
                        offset: '',
                        treadRest_1: '',
                        treadRest_2: '',
                        spacesCenterHole: '',
                        advertPhoneNumber: '',
                        advertDescription: ''
                    });

                    $rootScope.setting.values = Service.getDefaultSettingParamsValues(
                        $rootScope.setting.params,
                        {
                            currency: 'usd',
                            advertType: 'wheels',
                            regions: '0',
                            wheelMaker: '0',
                            tyresMaker: '0',
                            priceFor: 'for_the_whole_lot',
                            quantity: '4'
                        },
                        false);
                    localStorageService.set('parameters', $rootScope.setting.params)
                } else {
                    $log.error(resData.data)
                }
                console.log('paramss done',$rootScope.setting.params)
                console.log($rootScope.setting.values)
            });
        } else {
            $rootScope.setting.values = Service.getDefaultSettingParamsValues(
                $rootScope.setting.params,
                {
                    currency: 'usd',
                    advertType: 'wheels',
                    regions: '0',
                    wheelMaker: '0',
                    tyresMaker: '0',
                    priceFor: 'for_the_whole_lot',
                    quantity: '4'
                },
                false);
        }
        /*-------------------------------------------------- установки [END] -----------------------------------------*/
        /*-------------------------------------------------- функции -------------------------------------------------*/

        // TODO сделать универсальные функции работы с полями выбора
        /* вызывается когда изменилось значение выпадающего списка параметра
         * нужно взять подсписок у текущего элемента,
         * и добавть этот подсписок в новый элемент
         * */
        $rootScope.customSelectInputChange = function (type, target) {
            $rootScope.setting.customSelect[type].disabled = false;
            $rootScope.setting.customSelect[type].placeholder = '';
            if(
                $rootScope.setting.params[target][$rootScope.setting.values[target]].models &&
                $rootScope.setting.params[target][$rootScope.setting.values[target]].models.length > 0)
            {
                $rootScope.setting.customSelect[type].mainDivClass = 'select-list';
            } else {
                $rootScope.setting.customSelect[type].mainDivClass = '';
            }
            $rootScope.setting.customSelect[type].value = '';
        };
        // фокус на блоке выбора модели
        //$rootScope.searchBlockFocus = function(){
        $rootScope.customSelectFocus = function(type){
            console.log('focus');

            $rootScope.setting.customSelect[type].itemListClass = 'show'
        };

        /*
         * при потери фокуса следует закрыть выпадающий список
         * */
        $rootScope.customSelectBlur = function(type){
            console.log('blur');

            $timeout(function(){
                $rootScope.setting.customSelect[type].itemListClass = '';
                var title = $rootScope.setting.customSelect[type].value;
                if(
                    !$rootScope.setting.values[type] ||
                    (
                        true
                    )) {
                        var item = {
                            new_key: true,
                            title: title.toUpperCase(),
                            key: title.toLowerCase().replace(/\s/g, '_'),
                        };
                        $rootScope.setting.values[type] = item;
                        console.log(item)
                    }
            }, 50);
        };

        // ивент выбора элемента из выпадающего кастомного списка
        $rootScope.customSelectChooseItem = function( item, type ){
            $rootScope.setting.values[type] = {key: item.key, title: item.title};
            $rootScope.setting.customSelect[type].value = item.title;
            $rootScope.setting.customSelect[type].itemListClass = '';
        };

        // вызывает модальное окно при клике на название параметра в фильтре
        $rootScope.getModalWithDescription = function(type) {
            $rootScope.modal.blockTextName = type+'_TEXT';
            Service.modal($rootScope, {
                size: 'sm',
                okButton: true,
                header: type,
                template: 'parameter_description'
            })
        };

        // сработает при получении или потере фокуса полем ввода поискового запроса_____________________________________
        $rootScope.searchInputFocus = function(type) {
            if(type) {
                $rootScope.searchInputBlock = 'active';
            } else {
                $rootScope.searchInputBlock = '';
            }

        };

        // обработчик нажатия на кнопку смены языка_____________________________________________________________________
        $rootScope.changelang = function(language) {
            $rootScope.userData.language = language;
            localStorageService.set('user_data', $rootScope.userData);

            if ($rootScope.userData.auth) {
                io.socket.post('/api/user/change_language', {language: language}, function (resData) {
                    if(resData) {

                        localStorageService.set('user_data', $rootScope.userData);
                    } else {
                        $log.error(resData)
                    }
                })
            }
        };

        // открытие закрытие модального окна логина, регистрации
        $rootScope.modalLoginOpenSwitcher = function (type) {
            $log.debug(controllerName+'.modalLoginOpenSwitcher');

            if(type == 'open' ) {
                Service.modal($rootScope,{
                    template: 'reg_auth',
                    crossButton: true
                });
            } else {
                Service.modal($rootScope);
            }
        };

        // переключение в модальном окне (вход - регистрация)___________________________________________________________
        $rootScope.modelLoginSwitch = function (type) {
            $log.debug(controllerName+'.modelLoginSwitch+');

            $rootScope.reg_auth.login.open = false;
            $rootScope.reg_auth.register.open = false;
            $rootScope.reg_auth[type].open = true;
        };

        // включение отключение блока "забыл пароль"____________________________________________________________________
        $rootScope.modelLoginForgot = function () {
            $log.debug(controllerName+'.modelLoginForgot');

            $rootScope.reg_auth.forgot.open = !$rootScope.reg_auth.forgot.open;
        };

        // функция авторизации, регистрации, восстановления пароля______________________________________________________
        $rootScope.loginFormFunction = function(type) {
            var data = {};
            switch (type) {
                case "login":
                    data = {
                        email: $rootScope.reg_auth.form[type].email,
                        password: md5.createHash($rootScope.reg_auth.form[type].password || '')
                    };
                    break;
                case "register":
                    data = {
                        username: $rootScope.reg_auth.form[type].username,
                        email: $rootScope.reg_auth.form[type].email,
                        password: md5.createHash($rootScope.reg_auth.form[type].password || ''),
                        confirmPassword: md5.createHash($rootScope.reg_auth.form[type].confirmPassword || '')
                    };
                    break;
                case "":
                    break;
            }

            io.socket.post('/api/user/'+type, data, function (resData) {
                if (resData.status) {
                    $rootScope.userData = resData.data;
                    $rootScope.userData.auth = true;
                    localStorageService.set('user_data', $rootScope.userData);
                    Service.modal($rootScope);
                    $rootScope.$digest();
                } else {
                    $log.error(resData.data)
                }
            })
        };

        // функция выхода_______________________________________________________________________________________________
        $rootScope.userLogout = function() {
            defaultUserData();
        };

        $rootScope.$watch( // TODO исправить
            function () {
                return window.innerWidth;
            },
            function (value) {
                $rootScope.windowWidth = value;
            },
            true
        );

        angular.element(window).bind('resize', function(){
            Service.allignImageInBlock($rootScope.windowWidth);
            $rootScope.$apply();
        });

        /* массив размеров для бутсрап классов для главной страницы галереи */
        $rootScope.screenWidthData = {
            0: '1',
            1: '430',
            2: '768',
            3: '992',
            4: '1200',
            5: '1200'
        };

        // устанавливает параметры по умолчанию для пользовательского объекта___________________________________________
        function defaultUserData() {
            $rootScope.userData = {
                auth: false,
                language: 'ru'
            };
            localStorageService.set('user_data', $rootScope.userData)
        }
        /*-------------------------------------------------- функции [END] -------------------------------------------*/
        /*-------------------------------------------------- код, который отрабатывает при загрузке контроллера ------*/
        // загрузка контроллера после обновления страницы_______________________________________________________________
        if(!$rootScope.userData) {
            // если пользователь уже заходил на сайт, и у него есть user_data
            if (localStorageService.get('user_data')) {
                // считываем user_data в рабочую переменную
                $rootScope.userData = localStorageService.get('user_data');
            } else {
                // если пользователь зашел впервые - устанавливаем ему user_data, сохраняя её в память
                defaultUserData();
            }
            $log.log('userData', $rootScope.userData);
        }

        // устанавливает цвет кнопки текущего языка при загрузке
        $rootScope.localizationButton = Service.getLocalizationButton($rootScope.userData.language);

        // отключение спинера загрузки страницы TODO сделать выключение спинера по загрузке всех данных_________________
        $timeout(function() {
            return document.getElementById('spinner').className = "spinnerFullBlock spinnerOff";
        },1000);

        /*-------------------------------------------------- [END] ---------------------------------------------------*/
        /*-------------------------------------------------- перехватчики --------------------------------------------*/
        // перехватываем пост для того, чтобы добавить токен в каждый запрос____________________________________________
        io.socket.post = new Proxy(io.socket.post, {
            apply: function (target, thisArgument, argumentsList) {
                var token = $rootScope.userData.token || null;
                if(typeof argumentsList[1] == 'object') {
                    argumentsList[1].token = token;
                } else if(typeof argumentsList[1] == 'function') {
                    argumentsList = [argumentsList[0],{token:token},argumentsList[1]];
                }
                return target.apply(thisArgument, argumentsList);
            }
        });

        // меняет цвет кнопки текущего языка
        $scope.$watch('userData.language',function(newVal, oldVal){
            if (newVal === oldVal) {
                return;
            }
            $rootScope.localizationButton = Service.getLocalizationButton($rootScope.userData.language)
        });
        /*-------------------------------------------------- перехватчики [END] --------------------------------------*/
    }
})();
