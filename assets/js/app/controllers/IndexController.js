(function(){
    "use strict";

    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function IndexController ($scope, $routeParams, $rootScope, Service) {
        console.log('GET IndexController');
        var _this = this;

        $rootScope._ = Service.getLocalizator();
        $scope.$watch('lang',function(newVal, oldVal){
            if (newVal === oldVal) {
                return;
            };
            $rootScope.localizationButton = Service.getLocalizationButton($rootScope.lang)
        });
        $rootScope.lang = $rootScope.lang || 'ru';
        $rootScope.localizationButton = Service.getLocalizationButton($rootScope.lang);
        $rootScope.changelang = function(lang) {
            $rootScope.lang = lang;
        };

        console.log($rootScope._['QWERTY'],$rootScope)
        $rootScope.modal = {
            login: false
        };
        this.modalOn = false;


        $rootScope.modalLoginOpen = function() {
            $rootScope.modalWindowClass = 'modal-shadow';
            $rootScope.modal.login = true;
        };

        $rootScope.modalLoginClose = function() {
            $rootScope.modal.login = false;
            $rootScope.modalWindowClass = ''
        };


        var w = angular.element(window);
        $scope.$watch(
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


        this.screenWidthData = {
            0: '1',
            1: '1',
            2: '768',
            3: '992',
            4: '1200',
            5: '1200'
        };

        this.adverdsArray = [
            {
                title: 'WHEELS_ON_SALE',
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
                title: 'WHEELS',
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
                title: 'TYRES',
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
                title: 'SPACES',
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
    }
})();