(function() {
    "use strict";
    var controllerName = 'IndexController';
    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope', '$routeParams', '$rootScope', 'Service', '$timeout', 'md5', 'localStorageService', '$log']
    function IndexController($scope, $routeParams, $rootScope, Service, $timeout, md5, localStorageService, $log) {
        $log.debug('GET IndexController');

        $scope.$watch( // TODO исправить
            function () {
                return window.innerWidth;
            },
            function (value) {
                $scope.windowWidth = value;
            },
            true
        );

        angular.element(window).bind('resize', function(){
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



        io.socket.post('/api/advert/get', function (resData) {
            console.log('GET ADVERTS');
            console.log(resData);
        });

        $scope.adverdsArray = [
            {
                title: 'WHEELS_ON_SALE',
                type: 'wheel',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/default.jpg',
                        price: '300$',
                        params: ['5x120',' 17','j9'],
                        id: '125640'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/default.jpg',
                        price: '140$',
                        params: ['4x100',' 13','j5.5'],
                        id: '125641'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/default.jpg',
                        price: '230$',
                        params: ['5x108',' 17','j10'],
                        id: '125642'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    },
                    {
                        type: 'wheels',
                        imgUrl: '/images/default.jpg',
                        price: '500$',
                        params: ['5x114','16','j8'],
                        id: '125644'
                    }
                ]
            },{
                title: 'TYRES_ON_SALE',
                type: 'tyres',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    }
                ]
            },{
                title: 'SPACES_ON_SALE',
                type: 'spaces',
                adverds: [
                    {
                        type: 'wheels',
                        imgUrl: '/images/test_adv.jpg',
                        price: '100$',
                        params: ['5x120',' 15','j9'],
                        id: '125643'
                    }
                ]
            }
        ];
        console.log(this.screenWidthData);
    };
})();