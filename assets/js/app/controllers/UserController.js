(function(){
    "use strict";

    angular.module("General").controller("UserController", UserController);

    UserController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function UserController ($scope,$routeParams,$rootScope,Service) {
        console.log('GET UserController');
        var _this = this;


    }
})();