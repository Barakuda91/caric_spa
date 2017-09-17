(function(){
    "use strict";
    var controllerName = 'UserController';
    angular.module("General").controller("UserController", UserController);

    UserController.$inject = [
        '$scope','$route','$routeParams','$rootScope','Service','md5','localStorageService','$location'
    ]
    function UserController ($scope,$route,$routeParams,$rootScope,Service,md5,localStorageService,$location) {
        console.log('GET UserController');
        var _this = this;
        switch($route.current.$$route.originalPath) {
            // страница настроек
            case '/user/settings':
                if ($rootScope.userData.auth) {
                    $scope.settings = {
                        show_disks : $rootScope.userData.settings.show_disks,
                        show_tires : $rootScope.userData.settings.show_tires,
                        show_spacers : $rootScope.userData.settings.show_spacers,
                        show_posts : $rootScope.userData.settings.show_posts,
                        show_currency : $rootScope.userData.settings.show_currency,
                        firstname : $rootScope.userData.settings.firstname,
                        lastname : $rootScope.userData.settings.lastname,
                        telephone : $rootScope.userData.settings.telephone,
                        password : '',
                        confirm_password: ''
                    };

                    $scope.saveUserSettings = function() {
                        var data = $scope.settings;
                        var res = Service.validateUserSettings(data);
                        if (res.password) {
                            if (data.password) {
                                data.newPasswordHash = md5.createHash(data.password || '');
                            } else {
                                data.newPasswordHash = null;
                            }
                            data.password = null;
                            data.confirm_password = null;

                            io.socket.post('/api/user/save_settings', data, function (resData) {
                                if (resData.status) {
                                    localStorageService.set(
                                        'user_data',
                                        Object.assign($rootScope.userData, {settings: $scope.settings})
                                    );
                                }
                                console.log(resData);
                            })
                        }
                    };
                } else {
                    /* Redirect not autorizated users to main page */
                    $location.path('/');
                }

                break;
        }



    }
})();