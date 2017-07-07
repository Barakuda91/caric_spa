(function(){
    "use strict";

    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function AdvertController ($scope,$routeParams,$rootScope,Service) {
        console.log('GET AdvertController');
        var _this = this;
        $scope.addAdvert = {};
        $scope.addAdvert.advertType = [
            {value: 'wheels', title: $rootScope._.WHEELS},
            {value: 'tyres', title: $rootScope._.TYRES},
            {value: 'spaces', title: $rootScope._.SPACES}
        ];
        $scope.addAdvert.advertTypeSelected = $scope.addAdvert.advertType[0];

        $scope.addAdvert.currency = [{ type: "USD", id: 0 }, { type: "UAH", id: 1 }];
        $scope.addAdvert.selectedCurrency = $scope.addAdvert.currency[0];
    }
})();