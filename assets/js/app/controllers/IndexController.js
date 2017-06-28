(function(){
    "use strict";

    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope','$routeParams','$rootScope']
    function IndexController ($scope, $routeParams, $rootScope) {
        $rootScope.modal = {
            login: false
        }
        $rootScope.modalOn = false;

        $rootScope.modalLoginOpen = function() {
            $rootScope.modalWindowClass = 'modal-shadow';
            $rootScope.modal.login = true;
        }

        $rootScope.modalLoginClose = function() {
            $rootScope.modal.login = false;
            $rootScope.modalWindowClass = ''
        }
    }
})();