(function(){
    "use strict";

    angular
        .module("General", [
            'ngRoute',
            'ngRoute.middleware',
            'angular-md5',
            'LocalStorageModule',
            'ngResource',
            'ngAnimate',
            'ngFileUpload',
            'ngSanitize'
        ])
        .config(GeneralConfig)
        .directive('dropdownList',function($rootScope, $timeout ){
            return {
                restrict: 'E',
                scope: {
                    itemsList: '='
                },
                template: ''+
                '<input type="text" ng-model="search" class="dropdown form-control form-control-sm" />' +
                '<div class="search-item-list">' +
                '   <ul class="list">' +
                '      <li ng-repeat="item in itemsList | filter:search" ng-click="chooseItem( item )">' +
                '           <span>{{ item.title }}</span>' +
                '       </li>' +
                '   </ul>' +
                '</div>',
                compile: function() {

                },
                link: function(scope, el, attr){
                    console.log('el',el)
                    var $listContainer = angular.element( el[0].querySelectorAll('.search-item-list')[0] );
                    // $rootScope.searchBlockFocus = function(){
                    //     console.log('focus');
                    //
                    //     $rootScope.searchItemList = 'show'
                    // };
                    //
                    // $rootScope.searchBlockBlur = function(){
                    //     console.log('blur');
                    //
                    //     $timeout(function(){ $rootScope.searchItemList = ''; }, 200);
                    // };
                    //
                    // $rootScope.chooseItem = function( item ){
                    //
                    //     $rootScope.search = item.name;
                    //     $rootScope.vallur = scope.search;
                    //     console.log(item);
                    //     $rootScope.searchItemList = '';
                    // }
                }
            }
        })
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
        }).filter('asHTML', function($sce) {
        return function(input) {
            console.log('223--------------')
            return $sce.getTrustedHtml(input);
        };
    });


    GeneralConfig.$inject = [// при минификации минификатор не сможет изменить название переменной, если она в строке
        '$routeProvider',
        '$locationProvider',
        '$middlewareProvider',
        'localStorageServiceProvider',
        '$logProvider',
        '$sanitizeProvider'
    ];

    function GeneralConfig ($routeProvider, $locationProvider, $middlewareProvider,localStorageServiceProvider,$logProvider,$sanitizeProvider) {
        var $log = angular.injector(['ng']).get('$log');
        $logProvider.debugEnabled(true);

        localStorageServiceProvider
            .setPrefix('caric')
            .setDefaultToCookie(false);

        $middlewareProvider.map({
            'getLocalization': function () {
                $log.debug('GET middleware.getLocalization');
                var _this = this;
                if(!window.localization_items ) {
                    io.socket.post('/api/params_settings/get_localization', {}, function (resData) {
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
            .when('/post/wheel/:id', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/post/tyre/:id', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/post/space/:id', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'
            })
            .when('/post/my/', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: 'view/index.html'

            })
            .when('/post/add/', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: '/view/post/add.html'
            })
            .when('/post/show/:id', {
                controller: 'GeneralController',
                //controllerAs: 'general',
                middleware: 'getLocalization',
                templateUrl: '/view/post/index.html'
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