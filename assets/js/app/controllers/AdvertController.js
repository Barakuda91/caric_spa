(function(){
    "use strict";

    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function AdvertController ($scope,$routeParams,$rootScope,Service) {
        console.log('GET AdvertController');
        var _this = this;


    }
})();