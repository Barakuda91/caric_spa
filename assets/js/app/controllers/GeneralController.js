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

        if (localStorageService.get('user_data')) {
            $rootScope.userData = localStorageService.get('user_data');
            $rootScope.userData.auth = true;
        } else {
            $rootScope.userData = {auth: false}
        }

        // отключение спинера загрузки страницы TODO сделать выключение спинера по загрузке всех данных
        $timeout(function() {
            return document.getElementById('spinner').className = "spinnerFullBlock spinnerOff";
        },1000);

        $rootScope.lang = $rootScope.lang || 'ru';
        $rootScope._    = $rootScope._    || Service.getLocalizator($rootScope);

        // меняет цвет кнопки текущего языка
        $scope.$watch('lang',function(newVal, oldVal){
            if (newVal === oldVal) {
                return;
            }
            $rootScope.localizationButton = Service.getLocalizationButton($rootScope.lang)
        });

        // устанавливает цвет кнопки текущего языка при загрузке
        $rootScope.localizationButton = Service.getLocalizationButton($rootScope.lang);

        // обработчик нажатия на кнопку смены языка
        $rootScope.changelang = function(lang) {
            $rootScope.lang = lang;
        };

        /*--- модалки START ---*/
        $rootScope.modalStatus = {
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

        // переключение в модальном окне (вход - регистрация)
        $rootScope.modelLoginSwitch = function (type) {
            $log.debug(controllerName+'.modelLoginSwitch+');

            $rootScope.modalStatus.reg_auth.login.open = false;
            $rootScope.modalStatus.reg_auth.register.open = false;
            $rootScope.modalStatus.reg_auth[type].open = true;
        };

        // включение отключение блока "забыл пароль"
        $rootScope.modelLoginForgot = function () {
            $log.debug(controllerName+'.modelLoginForgot');

            $rootScope.modalStatus.reg_auth.forgot.open = !$rootScope.modalStatus.reg_auth.forgot.open;
        };

        // функция авторизаци
        // регистрации
        // восстановления пароля
        $rootScope.loginFormFunction = function(type) {

            var data = {
                email: $rootScope.modalStatus.form[type].email,
                password: md5.createHash($rootScope.modalStatus.form[type].password || ''),
                confirmPassword: md5.createHash($rootScope.modalStatus.form[type].confirmPassword || '')
            };

            io.socket.post('/api/user/'+type, data, function (resData) {
                if (resData.status) {
                    $rootScope.userData = resData.data;
                    $rootScope.userData.auth = true;
                    $rootScope.modalStatus.reg_auth.open = false;
                    localStorageService.set('user_data', resData.data);
                } else {
                    alert(resData.data)
                }
            })
        };

        $rootScope.modalShadowClick = function() {
            console.log('modalShadowClick');
        };

        /*--- настройки модалок END ---*/

        /*--- загрузка Params settings  ---*/
        if(!$rootScope.settingParams) {
            $rootScope.settingParams = {ready: false};
            io.socket.post('/api/params_settings/get', {}, function (resData) {
                if (resData.status) {
                    $rootScope.settingParams = {
                        advertType:     Service.getSettingParameter(resData.data.advertType),
                        currency:       Service.getSettingParameter(resData.data.currency),
                        productionYear: Service.getSettingParameter(resData.data.productionYear),
                        pcd:            Service.getSettingParameter(resData.data.pcd),
                        diameter:       Service.getSettingParameter(resData.data.diameter),
                        material:       Service.getSettingParameter(resData.data.material),
                        tyreType:       Service.getSettingParameter(resData.data.tyreType),
                        tyreHeight:     Service.getSettingParameter(resData.data.tyreHeight),
                        //tyreMaker:      Service.getSettingParameter(resData.data.tyreMaker),
                        //tyreModel:      Service.getSettingParameter(resData.data.tyreModel),
                        tyreWidth:      Service.getSettingParameter(resData.data.tyreWidth),
                        tyreSpeedIndex: Service.getSettingParameter(resData.data.tyreSpeedIndex),
                        tyreLoadIndex:  Service.getSettingParameter(resData.data.tyreLoadIndex),
                        wheelType:      Service.getSettingParameter(resData.data.wheelType),
                        wheelWidth:     Service.getSettingParameter(resData.data.wheelWidth),
                        wheelEt:        Service.getSettingParameter(resData.data.wheelEt),
                        //wheelMaker:     Service.getSettingParameter(resData.data.wheelMaker),
                        //wheelModel:     Service.getSettingParameter(resData.data.wheelModel),
                        spacesType:     Service.getSettingParameter(resData.data.spacesType),
                        fastenersType:  Service.getSettingParameter(resData.data.fastenersType),
                        regions:        Service.getSettingParameter(resData.data.regions),
                        spacesWidth:    '',
                        price:          '',
                        centerHole:     '',
                        offset:         '',
                        treadRest_1:    '',
                        treadRest_2:    '',
                        spacesCenterHole:   '',
                        advertPhoneNumber:  '',
                        advertDescription:  ''

                    };
                    if (!$rootScope.settingParams.defaultSelected) {
                        $rootScope.settingParams.values = Service.getDefaultSettingParamsValues(
                            $rootScope.settingParams,
                            {
                                currency: 'usd',
                                advertType: 'wheels'
                            },
                            false);
                    }
                } else {
                    console.log('err', resData.data)
                }
            });
        } else {
            $rootScope.settingParams.defaultSelected = false;
            $rootScope.settingParams.values = Service.getDefaultSettingParamsValues(
                $rootScope.settingParams,
                {
                    currency: $rootScope.settingParams.currency[0].key,
                    advertType:$rootScope.settingParams.advertType[0].key,
                },
                false);
        }
        /*--- загрузка Params settings END  ---*/

        $rootScope.userLogout = function() {
            $rootScope.userData = {auth: false};
            localStorageService.remove('user_data');
        };


    }
})();