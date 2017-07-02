(function(){
    "use strict";

    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function IndexController ($scope, $routeParams, $rootScope, Service) {
        console.log('GET IndexController');
        var _this = this;

        $rootScope.lang = $rootScope.lang || 'ru';
        $rootScope._ = Service.getLocalizator();
        console.log($rootScope._,$rootScope)
        $rootScope.modal = {
            login: false
        };
        this.modalOn = false;


        this.modalLoginOpen = function() {
            $rootScope.modalWindowClass = 'modal-shadow';
            $rootScope.modal.login = true;
        };

        this.modalLoginClose = function() {
            $rootScope.modal.login = false;
            $rootScope.modalWindowClass = ''
        };

        $rootScope.changelang = function(lang) {
            $rootScope.lang = lang;
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
                title: 'TYRES_ON_SALE'
            },{
                title: 'SPACES_ON_SALE'
            },{
                title: 'WHEELS'
            },{
                title: 'TYRES'
            },{
                title: 'SPACES'
            }
        ];
    }
})();