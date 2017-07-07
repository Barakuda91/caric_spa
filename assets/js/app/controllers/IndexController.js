(function(){
    "use strict";

    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope','$routeParams','$rootScope','Service','$timeout', 'md5', 'localStorageService']
    function IndexController ($scope, $routeParams, $rootScope, Service,$timeout,md5,localStorageService) {
        console.log('GET IndexController');
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
            if(type == 'open' ) {
                $rootScope.modal.shadow = true;
                $rootScope.modal.reg_auth.open = true;
            } else {
                $rootScope.modal.reg_auth.open = false;
                $rootScope.modal.shadow = false;
            }
        };

        // переключение в модальном окне (вход - регистрация)
        $rootScope.modelLoginSwitch = function (type) {
            $rootScope.modal.reg_auth.login.open = false;
            $rootScope.modal.reg_auth.register.open = false;
            $rootScope.modal.reg_auth[type].open = true;
        };

        // включение отключение блока "забыл пароль"
        $rootScope.modelLoginForgot = function () {
            $rootScope.modal.reg_auth.forgot.open = !$rootScope.modal.reg_auth.forgot.open;
        };

        // $rootScope.modal.form.register.username.validationClass
        // $rootScope.modal.form.register.email.validationClass
        // $rootScope.modal.form.register.password.validationClass
        // $rootScope.modal.form.register.confirmPassword.validationClass
        //
        //
        // fa-check-square-o
        // fa-square-o

        // функция авторизаци
        // регистрации
        // восстановления пароля
        $rootScope.loginFormFunction = function(type) {

            var data = {
                email: $rootScope.modal.form[type].email,
                password: md5.createHash($rootScope.modal.form[type].password || ''),
                confirmPassword: md5.createHash($rootScope.modal.form[type].confirmPassword || '')
            };

            io.socket.post('/api/user/'+type, data, function (resData) {
                console.log(resData)
                if (resData.status) {
                    $rootScope.userData = resData.data;
                    $rootScope.userData.auth = true;
                    $rootScope.modal.reg_auth.open = false;
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

        $rootScope.userLogout = function() {
            $rootScope.userData = {auth: false};
            localStorageService.remove('user_data');
        }

        var w = angular.element(window);
        $scope.$watch(
            function () {
                return window.innerWidth;
            },
            function (value) {
                $scope.windowWidth = value;
            },
            true
        );

        w.bind('resize', function(){
            $scope.$apply();
        });


        this.screenWidthData = {
            0: '1',
            1: '1',
            2: '768',
            3: '992',
            4: '1200',
            5: '1200'
        };

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