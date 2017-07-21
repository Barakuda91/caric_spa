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
        $rootScope._    = $rootScope._    || Service.getLocalizator($rootScope);

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

        // массив настроек обязательных полей при подаче объявления_____________________________________________________
        var requiredSetting = {
            wheels: {
                wheelType:  true,
                wheelWidth: true,
                pcd: true,
                diameter: true,
                price: true
            },
            tyres: {
                tyreType: true,
                diameter: true,
                tyreWidth: true,
                tyreHeight: true,
                price: true
            },
            spaces: {
                pcdSpacesFrom: true,
                spacesWidth: true,
                price: true
            }
        };


        // создаём объект для работы с параметрами
        $rootScope.setting = {
            // вытягиваем список параметров из локалдьной базы
            params: localStorageService.get('settingParameters') || {},
            // устанавливаем массив обязательных полей
            required: requiredSetting,
            values: {}
        };

        // установка значений параметров для фильтров, подачи объявлений и т.д__________________________________________
        // TODO перенести эту хуйню в сервисы ДОЛОЙ ЛОГИКУ ИЗ КОНТРОЛЛЕРОВ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log($rootScope.setting,$rootScope.setting.length)
        // если в локальной базе нет параметров - загружаем их
        //if(!$rootScope.setting.params) {
        if (true) {


            io.socket.post('/api/params_settings/get', {}, function (resData) {
                if (resData.status) {
                    $rootScope.setting.params = {
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
                        //tyreMaker:      Service.getSettingParameter(resData.data.tyreMaker),
                        //tyreModel:      Service.getSettingParameter(resData.data.tyreModel),
                        tyreWidth: Service.getSettingParameter(resData.data.tyreWidth),
                        tyreSpeedIndex: Service.getSettingParameter(resData.data.tyreSpeedIndex),
                        tyreLoadIndex: Service.getSettingParameter(resData.data.tyreLoadIndex),
                        wheelType: Service.getSettingParameter(resData.data.wheelType),
                        wheelWidth: Service.getSettingParameter(resData.data.wheelWidth),
                        wheelEt: Service.getSettingParameter(resData.data.wheelEt),
                        //wheelMaker:     Service.getSettingParameter(resData.data.wheelMaker),
                        //wheelModel:     Service.getSettingParameter(resData.data.wheelModel),
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
                    };

                    $rootScope.setting.values = Service.getDefaultSettingParamsValues(
                        $rootScope.setting.params,
                        {
                            currency: 'usd',
                            advertType: 'wheels',
                            regions: '0',
                            priceFor: 'for_the_whole_lot',
                            quantity: '4'
                        },
                        false);
                    localStorageService.set('parameters', $rootScope.setting.params)
                } else {
                    $log.error(resData.data)
                }
            });
        } else {
            $rootScope.setting.values = Service.getDefaultSettingParamsValues(
                $rootScope.setting.params,
                {
                    currency: 'usd',
                    advertType: 'wheels',
                    regions: '0',
                    priceFor: 'for_the_whole_lot',
                    quantity: '4'
                },
                false);
        }
        /*-------------------------------------------------- установки [END] -----------------------------------------*/
        /*-------------------------------------------------- функции -------------------------------------------------*/
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

            $rootScope.modal.reg_auth.login.open = false;
            $rootScope.modal.reg_auth.register.open = false;
            $rootScope.modal.reg_auth[type].open = true;
        };

        // включение отключение блока "забыл пароль"____________________________________________________________________
        $rootScope.modelLoginForgot = function () {
            $log.debug(controllerName+'.modelLoginForgot');

            $rootScope.modal.reg_auth.forgot.open = !$rootScope.modal.reg_auth.forgot.open;
        };

        // функция авторизации, регистрации, восстановления пароля______________________________________________________
        $rootScope.loginFormFunction = function(type) {
            var data = {};

            switch (type) {
                case "login":
                    data = {
                        email: $rootScope.modal.form[type].email,
                        password: md5.createHash($rootScope.modal.form[type].password || '')
                    };
                    break;
                case "register":
                    data = {
                        username: $rootScope.modal.form[type].username,
                        email: $rootScope.modal.form[type].email,
                        password: md5.createHash($rootScope.modal.form[type].password || ''),
                        confirmPassword: md5.createHash($rootScope.modal.form[type].confirmPassword || '')
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
                    alert(resData.data)
                }
            })
        };

        // функция выхода_______________________________________________________________________________________________
        $rootScope.userLogout = function() {
            defaultUserData();
        };

        // устанавливает параметры по умолчанию для пользовательского объекта___________________________________________
        function defaultUserData() {
            $rootScope.userData = {
                auth: false,
                language: 'ru'
            };
            localStorageService.set('user_data', $rootScope.userData)
        };
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
