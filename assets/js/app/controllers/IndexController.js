(function() {
    "use strict";
    var controllerName = 'IndexController';
    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope', '$routeParams', '$rootScope', 'Service', '$timeout', 'md5', 'localStorageService', '$log']
    function IndexController($scope, $routeParams, $rootScope, Service, $timeout, md5, localStorageService, $log) {
        console.log('GET IndexController');

        var w = angular.element(window);

        $scope.$watch( // TODO исправить
            function () {
                return window.innerWidth;
            },
            function (value) {
                $scope.windowWidth = value;
            },
            true
        );

        w.bind('resize', function(){
            $scope.$apply();
        });

        $scope.screenWidthData = {
            0: '1',
            1: '430',
            2: '768',
            3: '992',
            4: '1200',
            5: '1200'
        };

        /* забираем из базы все обьявы и гереним галереи по типам */
        if (!$rootScope.adverdsArray) {
            io.socket.post('/api/post/get', {filters:'index'}, function (resData) {
                console.log('GET ADVERTS ---');
                console.log(resData);
                var formatedData = [];
                var tempWheels = [];
                var tempTyres = [];
                var tempSpasers = [];
                if ('undefined' != typeof(resData.data)) {
                    for (var key in resData.data) {
                        var currencySymbol = ('usd' === resData.data[key].currency) ? '$' : 'грн.';
                        if (!resData.data[key].price) {
                            var priceCombined = '';
                        } else {
                            var priceCombined = resData.data[key].price + currencySymbol;

                        }

                        switch (resData.data[key].advertType) {
                            case 'wheels':
                                tempWheels.push(
                                    {
                                        type: resData.data[key].advertType,
                                        imgUrl: '/images/test_adv.jpg',
                                        price: priceCombined,
                                        params: [resData.data[key].pcd, resData.data[key].diameter, resData.data[key].wheelWidth],
                                        id: resData.data[key].id
                                    }
                                );
                                break;

                            case 'tyres':
                                tempTyres.push(
                                    {
                                        type: resData.data[key].advertType,
                                        imgUrl: '/images/test_adv.jpg',
                                        price: priceCombined,
                                        params: [resData.data[key].tyreWidth, resData.data[key].tyreHeight, resData.data[key].diameter],
                                        id: resData.data[key].id
                                    }
                                );
                                break;

                            case 'spaces':
                                tempSpasers.push(
                                    {
                                        type: resData.data[key].advertType,
                                        imgUrl: '/images/test_adv.jpg',
                                        price: priceCombined,
                                        params: [resData.data[key].pcdSpacesFrom, resData.data[key].pcdSpacesTo, resData.data[key].spacesWidth],
                                        id: resData.data[key].id
                                    }
                                );
                                break;
                        }
                    }
                    formatedData.push({
                        title: 'WHEELS_ON_SALE',
                        type: 'wheels',
                        adverds: tempWheels
                    });
                    formatedData.push({
                        title: 'TYRES_ON_SALE',
                        type: 'tyres',
                        adverds: tempTyres
                    });
                    formatedData.push({
                        title: 'SPACES_ON_SALE',
                        type: 'spaces',
                        adverds: tempSpasers
                    })
                }
                console.log('FORMATED DATA');
                console.log(formatedData);
                $rootScope.adverdsArray = formatedData;
            })
        }
    };
})();