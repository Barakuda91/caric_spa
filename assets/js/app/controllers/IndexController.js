(function() {
    "use strict";

    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope', '$routeParams', '$rootScope', 'Service', '$timeout', 'md5', 'localStorageService']
    function IndexController($scope, $routeParams, $rootScope, Service, $timeout, md5, localStorageService) {
        console.log('GET IndexController');

    };
})();