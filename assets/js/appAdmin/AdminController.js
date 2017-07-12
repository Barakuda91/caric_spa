(function(){
    "use strict";

    angular.module("Admin").controller("AdminController", AdminController);

    AdminController.$inject = ['$scope', '$route','$routeParams','$filter']
    function AdminController ($scope, $route, $routeParams, $filter) {
        console.log('Admin');

        $scope.settingParams = {};
        $scope.bdDump = 'saveUp';

        io.socket.post('/api/params_settings/get_localization', {}, function (resData) {
            console.log(resData);
            $scope.settingParams = resData.data;
            $scope.$digest();
        });


        $scope.addNewAlias = function() {
            if ($scope.newAlias.length > 0 && !$scope.settingParams[$scope.newAlias]) {
                $scope.settingParams[$scope.newAlias] = $scope.newTransl;
                $scope.newAlias = $scope.newTransl = '';
            }
        };

        $scope.updateLocalization = function () {
            io.socket.post('/api/params_settings/set_localization', $scope.settingParams, function (resData) {
                if(resData.status) {
                    alert('Succsess');
                } else {
                    alert('Error');
                }
            });

        };

        $scope.goMainPage = function() {

            $route.reload();
        }
    }
})();