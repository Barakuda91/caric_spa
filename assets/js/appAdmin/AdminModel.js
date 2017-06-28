(function(){
    "use strict";

    angular
        .module("Admin", [
            'ngRoute',
            'ngResource'
        ])
        .config(AdminConfig);

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