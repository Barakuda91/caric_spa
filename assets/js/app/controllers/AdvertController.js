(function(){
    "use strict";
    var controllerName = 'AdvertController';
    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service','$log']
    function AdvertController ($scope,$routeParams,$rootScope,Service,$log) {
        $log.debug('GET '+controllerName);
        var _this = this;

        $scope.advertSubbmit = function() {


            io.socket.post('/api/advert/save', $scope.settingParams.values, function (resData) {
                if(resData.status) {
//                    $rootScope.modal('success')
                    console.log($rootScope.settingParams)
                    $scope.settingParams.values = Service.getDefaultSettingParamsValues($rootScope.settingParams);
                    $scope.$digest()
                    //alert('success');






                    // todo закончить подачу объявления, почему не обновляются пустые поля.
                    // возможно проблема в обасти видимости
                }
            })
        }
    }
})();