(function(){
    "use strict";

    angular.module("Admin").controller("AdminController", AdminController);

    AdminController.$inject = ['$scope', '$route','$routeParams']
    function AdminController ($scope, $route, $routeParams) {
        console.log('Admin');
        $scope.goMainPage = function() {

            $route.reload();
        }
    }
})();