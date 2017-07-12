(function(){
    "use strict";
    var controllerName = 'GeneralController';

    angular.module("General").controller("GeneralController", GeneralController);

    GeneralController.$inject = ['$scope','$routeParams','$rootScope','Service','$timeout', 'md5', 'localStorageService','$log']
    function GeneralController ($scope, $routeParams, $rootScope, Service,$timeout,md5,localStorageService,$log) {
        $log.debug('GET '+controllerName);
        var _this = this;

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
        // TODO переделать модалки. структурировать код, вынести методы в сервис

        $rootScope.modal = function(type) {

        };
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
                $rootScope.modalStatus.shadow = true;
                $rootScope.modalStatus.reg_auth.open = true;
            } else {
                $rootScope.modalStatus.reg_auth.open = false;
                $rootScope.modalStatus.shadow = false;
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
                console.log(resData)
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
                    console.log(resData.data);
                    $rootScope.settingParams = {
                        defaultSelected:$rootScope.settingParams.defaultSelected || false,
                        advertType:     resData.data.advertType,
                        currency:       resData.data.currency,
                        productionYear: resData.data.productionYear,
                        pcd:            resData.data.pcd,
                        diameter:       resData.data.diameter,
                        material:       resData.data.material,
                        tyreType:       resData.data.tyreType,
                        tyreHeight:     resData.data.tyreHeight,
                        tyreMaker:      resData.data.tyreMaker,
                        tyreModel:      resData.data.tyreModel,
                        tyreWidth:      resData.data.tyreWidth,
                        tyreSpeedIndex: resData.data.tyreSpeedIndex,
                        tyreLoadIndex:  resData.data.tyreLoadIndex,
                        wheelType:      resData.data.wheelType,
                        wheelWidth:     resData.data.wheelWidth,
                        wheelEt:        resData.data.wheelEt,
                        wheelMaker:     resData.data.wheelMaker,
                        wheelModel:     resData.data.wheelModel,
                        spacesType:     resData.data.spacesType,
                        fastenersType:  resData.data.fastenersType,
                        regions:         resData.data.regions
                    };

                    if (!$rootScope.settingParams.defaultSelected) {
                        $rootScope.settingParams.values = Service.getDefaultSettingParamsValues($rootScope.settingParams);
                    }
                } else {
                    console.log('err', resData.data)
                }
            });
        } else {
            $rootScope.settingParams.defaultSelected = false;
            $rootScope.settingParams.values = Service.getDefaultSettingParamsValues($rootScope.settingParams);
        }
        /*--- загрузка Params settings END  ---*/

        $rootScope.userLogout = function() {
            $rootScope.userData = {auth: false};
            localStorageService.remove('user_data');
        }



        this.adverdsArray = [
            {
                title: 'WHEELS_ON_SALE',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/default.jpg',
                        price: '300$',
                        params: ['5x120',' 17','j9'],
                        id: '125640'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/default.jpg',
                        price: '140$',
                        params: ['4x100',' 13','j5.5'],
                        id: '125641'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/default.jpg',
                        price: '230$',
                        params: ['5x108',' 17','j10'],
                        id: '125642'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/default.jpg',
                        price: '500$',
                        params: ['5x114','16','j8'],
                        id: '125644'
                    }
                ]
            },{
                title: 'TYRES_ON_SALE',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    }
                ]
            },{
                title: 'SPACES_ON_SALE',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    }
                ]
            },{
                title: 'WHEELS',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    }
                ]
            },{
                title: 'TYRES',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    }
                ]
            },{
                title: 'SPACES',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    }
                ]
            }
        ];
    }
})();