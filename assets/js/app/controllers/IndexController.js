(function() {
    "use strict";
    var controllerName = 'IndexController';
    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope', '$routeParams', '$rootScope', 'Service', '$timeout', 'md5', 'localStorageService', '$log']
    function IndexController($scope, $routeParams, $rootScope, Service, $timeout, md5, localStorageService, $log) {
        console.log('GET IndexController');

        var w = angular.element(window);
        $scope.$watch( // TODO исправить
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
            1: '430',
            2: '768',
            3: '992',
            4: '1200',
            5: '1200'
        };
    IndexController.$inject = ['$scope', '$routeParams', '$rootScope', 'Service', '$timeout', 'md5', 'localStorageService','$log']
    function IndexController($scope, $routeParams, $rootScope, Service, $timeout, md5, localStorageService,$log) {
        $log.debug('GET '+controllerName);
    };
})();