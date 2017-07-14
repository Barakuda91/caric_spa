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


    GeneralConfig.$inject = [// при минификации минификатор не сможет изменить название переменной, если она в строке
        '$routeProvider',
        '$locationProvider',
        '$middlewareProvider',
        'localStorageServiceProvider',
        '$logProvider'];

    function GeneralConfig ($routeProvider, $locationProvider, $middlewareProvider,localStorageServiceProvider,$logProvider) {
        var $log = angular.injector(['ng']).get('$log');
        $logProvider.debugEnabled(false);

        localStorageServiceProvider
            .setPrefix('caric')
            .setDefaultToCookie(false);


        $middlewareProvider.map({
            'getLocalization': function () {
                $log.debug('GET middleware.getLocalization');
                var _this = this;
                if(!window.localization_items ) {
                    io.socket.post('/api/params_settings/get_localization', {}, function (resData) {
                        console.log(resData.data)
                        window.localization_items = resData.data;
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
                //controllerAs: 'general',
                controller: 'GeneralController',
                middleware: 'getLocalization'
            })
            .when('/list/:type', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                templateUrl: '/view/list/index.html',
                middleware: 'getLocalization'
            })
            .when('/advert/wheel/:id', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/tyre/:id', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/space/:id', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/advert/my/', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'

            })
            .when('/advert/add/', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: '/view/adv/add.html'
            })
            .when('/user/settings', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: '/view/user/settings.html'
            })
            .when('/user/adverts', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/user/alladdv.html'
            })
            .when('/user/messages', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/user/messages.html'
            });
    }
})();