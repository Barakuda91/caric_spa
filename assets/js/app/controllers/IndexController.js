(function() {
    "use strict";
    var controllerName = 'IndexController';
    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope', '$routeParams', '$rootScope', 'Service', '$timeout', 'md5', 'localStorageService', '$log']
    function IndexController($scope, $routeParams, $rootScope, Service, $timeout, md5, localStorageService, $log) {
        $log.debug('GET IndexController');

        /* забираем из базы все обьявы и гереним галереи по типам */
        if (!$rootScope.advertsArray) {
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
                                var advertUrl = Service.formatAdvertUrl(
                                    {
                                        id: resData.data[key]._id,
                                        params: [resData.data[key].pcd, resData.data[key].diameter, resData.data[key].wheelWidth]
                                    }
                                );
                                tempWheels.push(
                                    {
                                        type: resData.data[key].advertType,
                                        imgUrl: '/images/test_adv.jpg',
                                        price: priceCombined,
                                        params: [resData.data[key].pcd, resData.data[key].diameter, resData.data[key].wheelWidth],
                                        id: resData.data[key]._id,
                                        url: advertUrl
                                    }
                                );
                                break;

                            case 'tyres':
                                var advertUrl = Service.formatAdvertUrl(
                                    {
                                        id: resData.data[key]._id,
                                        params: [resData.data[key].tyreWidth, resData.data[key].tyreHeight, resData.data[key].diameter]
                                    }
                                );
                                tempTyres.push(
                                    {
                                        type: resData.data[key].advertType,
                                        price: priceCombined,
                                        params: [resData.data[key].tyreWidth, resData.data[key].tyreHeight, resData.data[key].diameter],
                                        id: resData.data[key]._id,
                                        url: advertUrl
                                    }
                                );
                                break;

                            case 'spaces':
                                var advertUrl = Service.formatAdvertUrl(
                                    {
                                        id: resData.data[key]._id,
                                        params: [resData.data[key].pcdSpacesFrom, resData.data[key].pcdSpacesTo, resData.data[key].spacesWidth],
                                    }
                                );
                                tempSpasers.push(
                                    {
                                        type: resData.data[key].advertType,
                                        price: priceCombined,
                                        params: [resData.data[key].pcdSpacesFrom, resData.data[key].pcdSpacesTo, resData.data[key].spacesWidth],
                                        id: resData.data[key]._id,
                                        url: advertUrl
                                    }
                                );
                                break;
                        }
                    }
                    formatedData.push({
                        title: 'WHEELS_ON_SALE',
                        type: 'wheels',
                        adverts: tempWheels
                    });
                    formatedData.push({
                        title: 'TYRES_ON_SALE',
                        type: 'tyres',
                        adverts: tempTyres
                    });
                    formatedData.push({
                        title: 'SPACES_ON_SALE',
                        type: 'spaces',
                        adverts: tempSpasers
                    })
                }
                console.log('FORMATED DATA');
                console.log(formatedData);
                $rootScope.advertsArray = formatedData;
            })
        }
    };
})();