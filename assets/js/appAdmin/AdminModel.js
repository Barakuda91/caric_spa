(function(){
    "use strict";

    angular
        .module("Admin", [
            'ngRoute',
            'ngResource'
        ])
        .config(AdminConfig)
        .filter('myFilter', function () {
            return function (items,sKey,sRu,sEn,sUa) {
                var result = {};

                if(sKey && sKey.length > 0) {
                    console.log(sKey);
                    for (var key in items) {
                        if (key.indexOf(sKey.toUpperCase()) + 1) {
                            result[key] = items[key];
                        }
                    }
                    return result;
                } else {
                    return items
                }
                // angular.forEach(items, function (value, key) {
                // // console.log(value)
                //
                //     angular.forEach(value, function (value2, key2) {
                //         if (value2 === search) {
                //         }
                //     })
                // });

            }
        });;

    AdminConfig.$inject = ['$routeProvider', '$locationProvider']; // при минификации минификатор не сможет изменить название переменной, если она в строке
    function AdminConfig ($routeProvider, $locationProvider) {
        $locationProvider
            .html5Mode({
                enabled: true,
                requireBase: false
            });

        $routeProvider
            .when('/modest_caric_spa', {
                controller: 'AdminController',
                templateUrl: 'view/admin/index.html'
            })
            .when('/', {
                templateUrl: function () {

                }
                //controller: 'IndexController',
                //templateUrl: 'view/index.html'
            })
            .otherwise({
                redirectTo: '/modest_caric_spa'
            });
    }
})();