(function(){
    "use strict";
    var  controllerName = 'AdminController';
    angular.module("Admin").controller("AdminController", AdminController);

    AdminController.$inject = ['$scope', '$route','$routeParams','$filter','localStorageService','$log']
    function AdminController ($scope,$route,$routeParams,$filter,localStorageService,$log) {
        $log.debug('GET '+controllerName);
console.log(localStorageService)
        $scope.localizationArray = {};
        $scope.bdDump = 'saveUp';


        // загружаем список локализации
        io.socket.post('/api/params_settings/get_localization', {}, function (resData) {
            console.log(resData);
            $scope.localizationArray = resData.data;
            $scope.$digest();
        });

        $scope.dbDump = function (type) {
            io.socket.post('/api/admin/dump/'+type, {}, function (resData) {
                if(resData.status) {
                    alert('DONE')
                } else {
                    console.log(resData);
                    alert('ERROR SEE CONSOLE')
                }
            });
        };

        //
        $scope.addNewAlias = function() {
            $log.debug(controllerName+'.addNewAlias');
            if ($scope.newAlias.length > 0 && !$scope.localizationArray[$scope.newAlias]) {
                $scope.localizationArray[$scope.newAlias] = $scope.newTransl;
                $scope.newAlias = $scope.newTransl = '';
            }
        };

        $scope.updateLocalization = function () {
            $log.debug(controllerName+'.updateLocalization');
            io.socket.post('/api/params_settings/set_localization', $scope.localizationArray, function (resData) {
                if(resData.status) {
                    alert('Succsess');
                } else {
                    alert('Error');
                }
            });
        };

        $scope.localizationFileSave = function() {
            $log.debug(controllerName+'.localizationFileSave');
        };

        $scope.localizationUpdateDb = function() {
            $log.debug(controllerName+'.localizationUpdateDb');
        };

        $scope.aliasRemove = function (key) {
            delete $scope.localizationArray[key];
        };
        
        $scope.goMainPage = function() {

            $route.reload();
        }
    }
})();