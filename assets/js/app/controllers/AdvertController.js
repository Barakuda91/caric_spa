(function(){
    "use strict";
    var controllerName = 'AdvertController';
    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service','$log']
    function AdvertController ($scope,$routeParams,$rootScope,Service,$log) {
        $log.debug('GET '+controllerName);
        $scope.advertSubmit = function() {

            io.socket.post('/api/advert/save', $scope.settingParams.values, function (resData) {
                if(resData.status) {
                    $scope.settingParams.values = Service.getDefaultSettingParamsValues($rootScope.settingParams);
                    Service.modal($rootScope, {
                        template: 'success',
                        delay: 3000,
                        size: 'sm'
                    });
                    $scope.$digest()

                }
            })
        }
    }
})();