(function(){
    "use strict";

    angular
        .module("General", [
            'ngRoute',
            'ngRoute.middleware',
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


    GeneralConfig.$inject = ['$routeProvider', '$locationProvider','$middlewareProvider']; // при минификации минификатор не сможет изменить название переменной, если она в строке
    function GeneralConfig ($routeProvider, $locationProvider, $middlewareProvider) {
        console.log('GET GeneralModule');
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
                controller: 'IndexController',
                controllerAs: 'index',
                middleware: 'getLocalization'
            })
            .when('/list/:type', {
                controller: 'IndexController',
                templateUrl: '/view/list/index.html',
                controllerAs: 'list',
                middleware: 'getLocalization'
            })
            .when('/advert/wheel/:id', {
                controller: 'IndexController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/tyre/:id', {
                controller: 'IndexController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/space/:id', {
                controller: 'IndexController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/my/', {
                controller: 'IndexController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'

            })
            .when('/advert/add/', {
                controller: 'IndexController',
                middleware: 'getLocalization',
                templateUrl: '/view/adv/add.html'
            })
            .when('/user/settings', {
                controller: 'IndexController',
                middleware: 'getLocalization',
                templateUrl: '/view/index.html'
            })
            .when('/user/login', {
                controller: 'IndexController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/user/signup', {
                controller: 'IndexController',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();