(function(){
    "use strict";
    var controllerName = 'AdvertController';
    angular.module("General").controller("AdvertController", AdvertController);

    AdvertController.$inject = ['$scope','$routeParams','$rootScope','Service','$log','Upload','$timeout']
    function AdvertController ($scope,$routeParams,$rootScope,Service,$log,Upload,$timeout) {
        $log.debug('GET '+controllerName);

        $scope.deleteImage = function(files, file) {
            console.log(files, file);
            delete files[file]
            console.log(files, file);
        };

        $scope.upload = function(new_files, invalid) {
            console.log(new_files, invalid)
        }
        //
        // $scope.upload = function (dataUrl, name) {
        //     Upload.upload({
        //         url: '/api/post/upload',
        //         data: {
        //             file: Upload.dataUrltoBlob(dataUrl, name)
        //         }
        //     }).then(function (response) {
        //         $timeout(function () {
        //             $scope.result = response.data;
        //         });
        //     }, function (response) {
        //         if (response.status > 0) {$scope.errorMsg = response.status
        //             + ': ' + response.data;}
        //     }, function (evt) {
        //         $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        //     });
        // }
        //
        //








        $scope.advertSubmit = function() {
            var setting = $scope.setting;
            for (var parameter in setting.required[setting.values.advertType]) {
                if(setting.values[parameter] === $rootScope.defaultParameterKeyName || setting.values[parameter] == '') {
                    $rootScope.modal = {
                      errorText: $rootScope._.PLEASE_SELECT_ALL_ELEMENTS
                    };
                    Service.modal($rootScope, {
                        template: 'error',
                        status: 'error',
                        header: 'MISSING_REQUIRED_PARAMETER',
                        size: 'sm',
                        okButton: true
                    });
                    return;
                }
            }

            io.socket.post('/api/post/save', setting.values, function (resData) {
                if(resData.status) {
                    setting.values = Service.getDefaultSettingParamsValues(setting.params);
                    Service.modal($rootScope, {
                        status: 'success',
                        header: 'ADVERT_ADD_SUCCESS',
                        okButton: true,
                        delay: 3000,
                        size: 'sm'
                    });
                }
            })
        }
        console.log('$routeParams');
        console.log($routeParams);
        /* инфа по обьяве храним в рутскопе если нету тянем из базы */
        if ($routeParams.id) {
            if (!$rootScope.advertInfo) {
                var urlId = $routeParams.id;
                var advertId = urlId.split('-').pop();
                console.log(advertId);
                io.socket.post('/api/post/get_one', {id: advertId}, function (resData) {
                    console.log('answer');
                    console.log(resData);
                    $rootScope.advertInfo = resData;
                })
            }
        }


    }
})();