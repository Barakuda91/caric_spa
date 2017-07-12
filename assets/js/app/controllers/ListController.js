(function(){
    "use strict";

    angular.module("General").controller("ListController", ListController);

    ListController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function ListController ($scope,$routeParams,$rootScope,Service) {
        console.log('GET ListController');
        var _this = this;

        $rootScope.settingParams.defaultSelected = true;
        $scope.listType = $routeParams.type;
        $scope.activList = {
            wheels: '',
            tyres: '',
            spaces: ''
        }
        $scope.activList[$routeParams.type] = 'disabled';
    }
})();