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
        .directive('answerField', function () {
            var el = {
                scope: true, //чтобы не засорять родительский скоп
                templateUrl: '/templates/ad-small-block.html'
            };
            console.log(el);
            return el;
        });


    GeneralConfig.$inject = ['$routeProvider', '$locationProvider','$middlewareProvider']; // при минификации минификатор не сможет изменить название переменной, если она в строке
    function GeneralConfig ($routeProvider, $locationProvider, $middlewareProvider) {
        console.log('GET GeneralModule');
        $middlewareProvider.map({
            'some': function someMiddleware() {
                console.log('GET middleware.some');
                var _this = this;
                io.socket.post('/api/localization', {}, function (resData, jwres) {
                    window.localization_items = resData[0];
                    _this.next();
                })

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
                middleware: 'some'
            })
            .when('/list/:type', {
                controller: 'ListController',
                templateUrl: '/view/list/index.html',
                controllerAs: 'list',
                middleware: 'some'
            })
            .when('/advert/wheel/:id', {
                controller: 'AdvertController',
                templateUrl: 'view/index.html'
            })
            .when('/advert/tyre/:id', {
                controller: 'AdvertController',
                templateUrl: 'view/index.html'
            })
            .when('/advert/space/:id', {
                controller: 'AdvertController',
                templateUrl: 'view/index.html'
            })
            .when('/advert/my/', {
                controller: 'AdvertController',
                templateUrl: 'view/index.html'

            })
            .when('/advert/add/', {
                controller: 'AdvertController',
                controllerAs: 'advert',
                middleware: 'some',
                templateUrl: '/view/adv/add.html'
            })
            .when('/user/settings', {
                controller: 'IndexController',
                templateUrl: '/view/index.html'
            })
            .when('/user/login', {
                controller: 'IndexController',
                templateUrl: 'view/index.html'
            })
            .when('/user/signup', {
                controller: 'IndexController',
                templateUrl: 'view/index.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();