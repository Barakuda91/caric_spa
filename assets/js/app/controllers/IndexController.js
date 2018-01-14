(function() {
  "use strict";
  var controllerName = 'IndexController';

  angular.module("General").controller("IndexController", IndexController);

  IndexController.$inject = ['$scope', '$routeParams', '$rootScope', 'Service', '$timeout', 'md5', 'localStorageService', '$log']
  function IndexController($scope, $routeParams, $rootScope, Service, $timeout, md5, localStorageService, $log) {
    $log.debug('GET IndexController');

    var formatedData = [];
    /* забираем из базы все обьявы и гереним галереи по типам */
    if (!$rootScope.advertsArray) {
      io.socket.post('/api/post/get', {filters:'index', search:{advertType: 'wheels'}, limit: 6, sort: -1, preview:true}, function (resData) {
        var tempWheels = [];

        for (var key in resData.data) {
          var advertUrl = Service.formatAdvertUrl(
            {
              id: resData.data[key]._id,
              params: [Service.defSelectCheck(resData.data[key].pcd), Service.defSelectCheck(resData.data[key].diameter), Service.defSelectCheck(resData.data[key].wheelWidth)]
            }
          );
          tempWheels.push({
            type: Service.defSelectCheck(resData.data[key].advertType),
            imgUrl: Service.defSelectCheck(resData.data[key].image),
            params: [Service.defSelectCheck(resData.data[key].pcd), 'R'+Service.defSelectCheck(resData.data[key].diameter), 'J'+Service.defSelectCheck(resData.data[key].wheelWidth)],
            id: resData.data[key]._id,
            url: advertUrl
          });
        }
        formatedData.push({
          title: 'WHEELS_ON_SALE',
          type: 'wheels',
          adverts: tempWheels
        });

        $rootScope.advertsArray = formatedData;
      });

      io.socket.post('/api/post/get', {filters:'index', search:{advertType: 'spaces'}, limit: 6, sort: -1, preview:true}, function (resData) {
        var tempSpasers = [];

        for (var key in resData.data) {
          console.log(resData.data)
          var advertUrl = Service.formatAdvertUrl(
            {
              id: resData.data[key]._id,
              params: [Service.defSelectCheck(resData.data[key].pcdSpacesFrom), Service.defSelectCheck(resData.data[key].pcdSpacesTo), Service.defSelectCheck(resData.data[key].spacesWidth)],
            }
          );
          tempSpasers.push({
            type: Service.defSelectCheck(resData.data[key].advertType),
            imgUrl: resData.data[key].image,
            params: [Service.defSelectCheck(resData.data[key].pcdSpacesFrom), Service.defSelectCheck(resData.data[key].pcdSpacesTo), 'ET'+Service.defSelectCheck(resData.data[key].spacesWidth)],
            id: resData.data[key]._id,
            url: advertUrl
          });
        }
        formatedData.push({
          title: 'SPACES_ON_SALE',
          type: 'spaces',
          adverts: tempSpasers
        });
        $rootScope.advertsArray = formatedData;
      });

      io.socket.post('/api/post/get', {filters:'index',search:{advertType: 'tyres'}, limit: 6, sort: -1, preview:true}, function (resData) {

        var tempTyres = [];

        for (var key in resData.data) {
          var advertUrl = Service.formatAdvertUrl(
            {
              id: resData.data[key]._id,
              params: [Service.defSelectCheck(resData.data[key].tyreWidth), Service.defSelectCheck(resData.data[key].tyreHeight), Service.defSelectCheck(resData.data[key].diameter)]
            }
          );
          tempTyres.push(
            {
              type: Service.defSelectCheck(resData.data[key].advertType),
              imgUrl: resData.data[key].image,
              params: [Service.defSelectCheck(resData.data[key].tyreWidth), Service.defSelectCheck(resData.data[key].tyreHeight), 'R'+Service.defSelectCheck(resData.data[key].diameter)],
              id: resData.data[key]._id,
              url: advertUrl
            }
          );
        }
        formatedData.push({
          title: 'TYRES_ON_SALE',
          type: 'tyres',
          adverts: tempTyres
        });
        $rootScope.advertsArray = formatedData;
      })
    }
  }
})();
