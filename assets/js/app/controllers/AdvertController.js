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

        // $scope.upload2 = function(new_files, invalid) {
        //     console.log(new_files, invalid)
        // }

        $scope.upload = function (files,errorFiles) {

            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    fileUpload(files[i])
                }
            }
        }



        function fileUpload(file) {
            Upload.upload({
                url: '/api/post/upload_file',
                data: {image: file, 'username': 'file_'+Date.now()}
            }).then(function (resp) {
                console.log('Success uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ');
            });
        }



        // обработчик нажатия кнопки подачи объявления
        $scope.advertSubmit = function() {
            var setting = $scope.setting;
            var advertArray = {};
            var badField = [];
            var showModalError = false;

            /* пройтись по массиву основных параметров, и наполнить массив конкртеного объявления
             * */
            for (var parameter in setting.advertAddSettingParams.general) {
                if(checkOnRequired(parameter, 'general'))
                {
                    advertArray[parameter] = setting.values[parameter];
                    setting.advertAddSettingParams.errorClass[parameter] = '';
                } else {
                    showModalError = true;
                    setting.advertAddSettingParams.errorClass[parameter] = 'required';
                }
            }

            for (var parameter in setting.advertAddSettingParams[setting.values.advertType]) {
                if(checkOnRequired(parameter, setting.values.advertType)) {
                    advertArray[parameter] = setting.values[parameter];
                    setting.advertAddSettingParams.errorClass[parameter] = '';
                } else {
                    showModalError = true;
                    setting.advertAddSettingParams.errorClass[parameter] = 'required';
                }
            }

            function checkOnRequired (parameter, type) {
                if(setting.advertAddSettingParams[type][parameter].required) {
                    var value = setting.values[parameter];
                    if (value === $rootScope.defaultParameterKeyName || typeof value == 'undefined'  || value.length == 0 ) {
                        return false
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
            console.log(advertArray)
            if (showModalError) {

                $timeout(function(){
                    angular.element("select.form-control-sm.required").change(function(e){
                            setting.advertAddSettingParams.errorClass = {};
                            $rootScope.$digest();
                        }
                    )},200);

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
            } else {
                return;
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
        }
        console.log('$routeParams');
        console.log($routeParams);
        /* инфа по обьяве храним в рутскопе если нету тянем из базы */
        if ($routeParams.id) {
            var urlId = $routeParams.id;
            var advertId = urlId.split('-').pop();
            io.socket.post('/api/post/get_one', {id: advertId}, function (resData) {
                console.log('answer');
                console.log(resData.data);
                resData.data.title = Service.createAdvertTitleByType(resData.data);
                $rootScope.advertInfo = resData.data;
            });
        }

    }
})();