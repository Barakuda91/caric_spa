(function(){
    "use strict";
    var controllerName = 'ListController';

    angular.module("General").controller("ListController", ListController);

    ListController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function ListController ($scope,$routeParams,$rootScope,Service) {
        console.log('GET ListController');
        var _this = this;

        $scope.listType = $routeParams.type;
        $scope.activList = {
            wheels: '',
            tyres: '',
            spaces: ''
        };
        $scope.activList[$routeParams.type] = 'disabled';
    }
})();