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
        '$templateCache'];
    function GeneralController ($scope,$rootScope,Service,$timeout,md5,localStorageService,$log,$templateCache) {
        $log.debug('GET '+controllerName);

        $rootScope.defaultUserData = function() {
            $rootScope.userData = {
                auth: false,
                language: 'ru'
            };
            localStorageService.set('user_data', $rootScope.userData)
        };

        // загрузка контроллера после обновления страницы
        if(!$rootScope.userData) {
            // если пользователь уже заходил на сайт, и у него есть user_data
            if (localStorageService.get('user_data')) {
                // считываем user_data в рабочую переменную
                $rootScope.userData = localStorageService.get('user_data');
            } else {
                // если пользователь зашел впервые - устанавливаем ему user_data, сохраняя её в память
                $rootScope.defaultUserData();
            }
            $log.log($rootScope.userData);
        }

        // перехватываем пост для того, чтобы добавить токен в каждый запрос
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

        // отключение спинера загрузки страницы TODO сделать выключение спинера по загрузке всех данных
        $timeout(function() {
            return document.getElementById('spinner').className = "spinnerFullBlock spinnerOff";
        },1000);

        $rootScope._    = $rootScope._    || Service.getLocalizator($rootScope);

        // меняет цвет кнопки текущего языка
        $scope.$watch('userData.language',function(newVal, oldVal){
            if (newVal === oldVal) {
                return;
            }
            $rootScope.localizationButton = Service.getLocalizationButton($rootScope.userData.language)
        });

        // устанавливает цвет кнопки текущего языка при загрузке
        $rootScope.localizationButton = Service.getLocalizationButton($rootScope.userData.language);

        // обработчик нажатия на кнопку смены языка
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

        /*--- модалки START ---*/
        $rootScope.modal = {
            reg_auth: {
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
            },
            shadow: false
        };

        // открытие закрытие модального окна логина, регистрации
        $rootScope.modalLoginOpenSwitcher = function (type) {
            $log.debug(controllerName+'.modalLoginOpenSwitcher');

            if(type == 'open' ) {
                Service.modal($rootScope,{
                    template: 'reg_auth'
                });
            } else {
                Service.modal($rootScope);
            }
        };

        /*-- переключение в модальном окне (вход - регистрация) --- */
        $rootScope.modelLoginSwitch = function (type) {
            $log.debug(controllerName+'.modelLoginSwitch+');

            $rootScope.modal.reg_auth.login.open = false;
            $rootScope.modal.reg_auth.register.open = false;
            $rootScope.modal.reg_auth[type].open = true;
        };

        /* --- включение отключение блока "забыл пароль" --- */
        $rootScope.modelLoginForgot = function () {
            $log.debug(controllerName+'.modelLoginForgot');

            $rootScope.modal.reg_auth.forgot.open = !$rootScope.modal.reg_auth.forgot.open;
        };

        /* --- функция авторизаци --- */
        // регистрации
        // восстановления пароля
        $rootScope.loginFormFunction = function(type) {
            var data = {}

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

        /*--- настройки модалок END ---*/

        /*--- загрузка Params settings  ---*/
        if(!$rootScope.setting) {
            io.socket.post('/api/params_settings/get', {}, function (resData) {
                if (resData.status) {
                    $rootScope.setting = {
                        params: {
                            advertType: Service.getSettingParameter(resData.data.advertType),
                            currency: Service.getSettingParameter(resData.data.currency),
                            priceFor: Service.getSettingParameter(resData.data.priceFor),
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
                            quantity: '',
                            spacesWidth: '',
                            price: '',
                            centerHole: '',
                            offset: '',
                            treadRest_1: '',
                            treadRest_2: '',
                            spacesCenterHole: '',
                            advertPhoneNumber: '',
                            advertDescription: ''
                        }
                    };
                        $rootScope.setting.values = Service.getDefaultSettingParamsValues(
                            $rootScope.setting.params,
                            {
                                currency: 'usd',
                                advertType: 'wheels',
                                regions: '0',
                                priceFor: 'for_the_whole_lot'
                            },
                            false);
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
                },
                false);
        }
        /*--- загрузка Params settings END  ---*/

/* --- функция выхода ---*/
        $rootScope.userLogout = function() {
            $rootScope.defaultUserData();
        };
    }
})();