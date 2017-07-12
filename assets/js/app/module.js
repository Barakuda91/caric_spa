(function(){
    "use strict";

    angular
        .module("General", [
            'ngRoute',
            'ngRoute.middleware',
            'angular-md5',
            'LocalStorageModule',
            'ngResource',
            'ngAnimate'
        ])
        .config(GeneralConfig)
        .directive('minCharsLength', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl) {
                    function minCharsLength(value) {
                        if (value.length >= attr.minCharsLength ) {
                            mCtrl.$setValidity('minCharsLength', true);
                        } else {
                            mCtrl.$setValidity('minCharsLength', false);
                        }
                        return value;
                    }
                    mCtrl.$parsers.push(minCharsLength);
                }
            };
        });


    GeneralConfig.$inject = ['$routeProvider', '$locationProvider','$middlewareProvider','localStorageServiceProvider']; // при минификации минификатор не сможет изменить название переменной, если она в строке
    function GeneralConfig ($routeProvider, $locationProvider, $middlewareProvider,localStorageServiceProvider) {
        console.log('GET GeneralModule');

        localStorageServiceProvider
            .setPrefix('caric')
            .setDefaultToCookie(false);


        $middlewareProvider.map({
            'getLocalization': function () {
                console.log('GET middleware.getLocalization');
                var _this = this;
                if(!window.localization_items ) {
                    io.socket.post('/api/localization', {}, function (resData, jwres) {
                        window.localization_items = resData[0];
                        _this.next();
                    })
                } else {
                    _this.next();
                }
            }
        });

        $locationProvider
            .html5Mode({
                enabled: true,
                requireBase: false
            });

        $routeProvider
            .when('/', {
                templateUrl: 'view/index.html',
                controller: 'GeneralController',
                controllerAs: 'index',
                middleware: 'getLocalization'
            })
            .when('/list/:type', {
                controller: 'GeneralController',
                templateUrl: '/view/list/index.html',
                controllerAs: 'list',
                middleware: 'getLocalization'
            })
            .when('/advert/wheel/:id', {
                controller: 'GeneralController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/tyre/:id', {
                controller: 'GeneralController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/space/:id', {
                controller: 'GeneralController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/my/', {
                controller: 'GeneralController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'

            })
            .when('/advert/add/', {
                controller: 'GeneralController',
                middleware: 'getLocalization',
                templateUrl: '/view/adv/add.html'
            })
            .when('/user/settings', {
                controller: 'GeneralController',
                middleware: 'getLocalization',
                templateUrl: '/view/user/settings.html'
            })
            .when('/user/adverts', {
                controller: 'GeneralController',
                middleware: 'getLocalization',
                templateUrl: 'view/user/alladdv.html'
            })
            .when('/user/messages', {
                controller: 'GeneralController',
                middleware: 'getLocalization',
                templateUrl: 'view/user/messages.html'
            });
    }
})();