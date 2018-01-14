(function(){
  "use strict";
  var controllerName = 'ListController';

  angular.module("General").controller("ListController", ListController);

  ListController.$inject = ['$scope','$routeParams','$rootScope','Service','$location']
  function ListController ($scope,$routeParams,$rootScope,Service,$location) {
    console.log('GET ListController');
    var _this = this;
    $scope.advertsCount = 0;
    $scope.advertType = $routeParams.advertType;
    $scope.activList = {
      wheels: '',
      tyres: '',
      spaces: ''
    };
    $scope.activList[$routeParams.advertType] = 'disabled';
    var data = [];
    for (var i = 0; i < 100; i++) data.push('Element #' + (i + 1));
    $scope.pagination = {
      page: 1,
      take: 5,
      maxSize: 11,
      list: [],
      data: data,
      activate: activate
    };
    function activate(page, take) {
      $scope.pagination.page = page;
      var list = [];
      for (var i = (page - 1) * take; i < page * take; i++) {
        list.push($scope.pagination.data[i]);
      }
      $scope.pagination.list = list;
    }



    //
    // $location.search('maker', 'fucker');
    // $location.search('model', 'huedel');
    // $location.search('maker', null);
    // ждем пока заполнятся все массивы параметров
    go(function() {

      for(var parameter in $routeParams) {
        if($rootScope.setting.params[parameter]) {
          $rootScope.setting.values[parameter] = $routeParams[parameter]
        }
      }

      console.log($rootScope.setting.advertAddSettingParams.errorClass)
      $rootScope.setting.advertAddSettingParams.errorClass = false;


      $scope.goSearchButton = createPostForSearch;
      createPostForSearch();
      function createPostForSearch() {
        $rootScope.setting.values.advertType = $routeParams.advertType;

        var search = removeUnwantedForSearchParameters(
          $rootScope.setting.values,
          ['PLEASE_SELECT','0'],
          ['currency','quantity','regions','city','priceFor']
        );

        for(var param in $routeParams) {
          if(param !== 'page') {
            $location.search(param, null);
          }
        }

        for(var param in search) {
          $location.search(param, search[param]);

        }


        io.socket.post('/api/post/get', {
          filters:'index',
          limit: 60,
          sort: -1,
          preview: true,
          search: search
        }, function (resData) {
          $scope.adverts = [];
          $scope.advertsCount = resData.data.length;

          for (var key in resData.data) {
            switch ($routeParams.advertType) {
              case 'wheels':
                var advertUrl = Service.formatAdvertUrl(
                  {
                    id: resData.data[key]._id,
                    params: [resData.data[key].pcd, resData.data[key].diameter, resData.data[key].wheelWidth]
                  }
                );
                $scope.adverts.push(
                  {
                    type: resData.data[key].advertType,
                    imgUrl: resData.data[key].image,
                    params: [resData.data[key].pcd, resData.data[key].diameter, resData.data[key].wheelWidth],
                    id: resData.data[key]._id,
                    url: advertUrl
                  }
                );
                $scope.$digest();
                break;

              case 'tyres':
                var advertUrl = Service.formatAdvertUrl(
                  {
                    id: resData.data[key]._id,
                    params: [resData.data[key].tyreWidth, resData.data[key].tyreHeight, resData.data[key].diameter]
                  }
                );
                $scope.adverts.push(
                  {
                    type: resData.data[key].advertType,
                    imgUrl: resData.data[key].image,
                    params: [resData.data[key].tyreWidth, resData.data[key].tyreHeight, resData.data[key].diameter],
                    id: resData.data[key]._id,
                    url: advertUrl
                  }
                );
                $scope.$digest();
                break;

              case 'spaces':
                var advertUrl = Service.formatAdvertUrl(
                  {
                    id: resData.data[key]._id,
                    params: [resData.data[key].pcdSpacesFrom, resData.data[key].pcdSpacesTo, resData.data[key].spacesWidth],
                  }
                );
                $scope.adverts.push(
                  {
                    type: resData.data[key].advertType,
                    imgUrl: resData.data[key].image,
                    params: [resData.data[key].pcdSpacesFrom, resData.data[key].pcdSpacesTo, resData.data[key].spacesWidth],
                    id: resData.data[key]._id,
                    url: advertUrl
                  }
                );
                $scope.$digest();
                break;
            }
          }
          $scope.$digest();
        });
      };
    });




    function removeUnwantedForSearchParameters(parametersObject, unwantedValuesArray,unwantedParametersArray) {
      var returnObject = {};
      for(var parameter in parametersObject) {
        //console.log(parameter,unwantedParametersArray.indexOf(parameter))
        if(
          unwantedParametersArray.indexOf(parameter) < 0 &&
          unwantedValuesArray.indexOf(parametersObject[parameter]) < 0
        ) {
          returnObject[parameter] = parametersObject[parameter];
        }
      }
      return returnObject;
    }

    function go( callback ) {
      if(typeof $rootScope.setting.params.advertType==='undefined')
        setTimeout(function(){go(callback)},100);else callback();
    }
  }
})();
