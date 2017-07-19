(function(){
    "use strict";
    var controllerName = 'AdvertController';
    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service','$log']
    function AdvertController ($scope,$routeParams,$rootScope,Service,$log) {
        $log.debug('GET '+controllerName);
        $scope.advertSubmit = function() {
            var setting = $scope.setting;
            for (var parameter in setting.required[setting.values.advertType]) {
            console.log(setting.values[parameter] > 10)
                if(setting.values[parameter] === $rootScope.defaultParameterKeyName || setting.values[parameter] < 20) {
                    $rootScope.modal = {
                      errorHeader: 'MISSING_REQUIRED_PARAMETER',
                      errorText: 'PLEASE_SELECT_ALL_ELEMENTS'
                    };
                    Service.modal($rootScope, {
                        template: 'error',
                        status: 'error',
                        header: 'MISSING_REQUIRED_PARAMETER',
                        size: 'sm',
                        okButton: true
                    });
                }
            }
return;
            io.socket.post('/api/post/save', $scope.settingParams.values, function (resData) {

                if(resData.status) {
                    $scope.settingParams.values = Service.getDefaultSettingParamsValues($rootScope.settingParams);
                    Service.modal($rootScope, {
                        template: 'success',
                        status: 'success',
                        delay: 3000,
                        size: 'sm'
                    });
                }
            })
        }
    }
})();