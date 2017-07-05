(function(){
    "use strict";

    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope','$routeParams','$rootScope','Service','$timeout']
    function IndexController ($scope, $routeParams, $rootScope, Service,$timeout) {
        console.log('GET IndexController');
        var _this = this;
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
            login: {
                open: false,
                loginOn: true,
                forgotOn: false
            },
            shadow: false
        };

        // открытие закрытие модального окна логина, регистрации
        $rootScope.modalLoginOpenSwitcher = function (type) {
            if(type == 'open' ) {
                $rootScope.modal.shadow = true;
                $rootScope.modal.login.open = true;
            } else {
                $rootScope.modal.login.open = false;
                $rootScope.modal.shadow = false;
            }
        };

        // переключение в модальном окне (вход регистрация)
        $rootScope.modelLoginSwitch = function (type) {
            $rootScope.modal.login.loginOn = (type == 'login');
        };

        // включение отключение блока "забыл пароль"
        $rootScope.modelLoginForgot = function () {
            $rootScope.modal.login.forgotOn = !$rootScope.modal.login.forgotOn;
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
            console.log($rootScope.modal.form[type])
            io.socket.post('/api/localization', {}, function (resData, jwres) {
                window.localization_items = resData[0];
                _this.next();
            })
        };

        $rootScope.modalShadowClick = function() {
            console.log('modalShadowClick');
        };

/*--- настройки модалок END ---*/
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