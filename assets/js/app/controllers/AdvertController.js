(function(){
    "use strict";

    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function AdvertController ($scope,$routeParams,$rootScope,Service) {
        console.log('GET AdvertController');
        var _this = this;

        $rootScope._ = Service.getLocalizator();
        $scope.$watch('lang',function(newVal, oldVal){
            if (newVal === oldVal) {
                return;
            };
            $rootScope.localizationButton = Service.getLocalizationButton($rootScope.lang)
        });
        $rootScope.lang = $rootScope.lang || 'ru';
        $rootScope.localizationButton = Service.getLocalizationButton($rootScope.lang);
        $rootScope.changelang = function(lang) {
            $rootScope.lang = lang;
        };

    }
})();