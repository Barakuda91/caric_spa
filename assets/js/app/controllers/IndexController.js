(function() {
    "use strict";
    var controllerName = 'IndexController';
    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope', '$routeParams', '$rootScope', 'Service', '$timeout', 'md5', 'localStorageService','$log']
    function IndexController($scope, $routeParams, $rootScope, Service, $timeout, md5, localStorageService,$log) {
        $log.debug('GET '+controllerName);
    };
})();