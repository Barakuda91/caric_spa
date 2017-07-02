(function(){
    "use strict";

    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function AdvertController ($scope,$routeParams,$rootScope,Service) {
        console.log('GET AdvertController');
        var _this = this;
        $rootScope._ = Service.getLocalizator();
        $rootScope.lang = 'ru';
        $rootScope.changelang = function(lang) {
            $rootScope.lang = lang;
        };

    }
})();