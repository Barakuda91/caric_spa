(function(){
    "use strict";

    angular.module("General").controller("ListController", ListController);

    ListController.$inject = ['$scope','$routeParams','$rootScope','Service']
    function ListController ($scope,$routeParams,$rootScope,Service) {
        console.log('GET ListController');
        var _this = this;


        var listSelectOption = {
            wheelType: [
                {
                    key: 'cast',
                    value: 'литой'
                },
                {
                    key: 'forged',
                    value: 'кованый'
                },
                {
                    key: 'stamped',
                    value: 'штампованый'
                },
                {
                    key: 'modular',
                    value: 'сборной'
                }
            ],
            tyreType: [
                {
                    key: 'winter',
                    value: 'зима'
                },
                {
                    key: 'summer',
                    value: 'лето'
                },
                {
                    key: 'allseason',
                    value: 'всесезонная'
                }
            ],
            carMaker: [ // авто производитель
                {
                    key: 'audi',
                    value: 'AUDI'
                },
                {
                    key: 'bmw',
                    value: 'BMW'
                },
                {
                    key: 'skoda',
                    value: 'SKODA'
                },
                {
                    key: 'nissan',
                    value: 'NISSAN'
                },
                {
                    key: 'opel',
                    value: 'OPEL'
                },
                {
                    key: 'volvo',
                    value: 'VOLVO'
                }
            ],
            tyreMaker: [ // производитель шины
                {
                    key: 'mishelien',
                    value: 'mishelien'
                },
                {
                    key: 'toyo',
                    value: 'toyo'
                }
            ],
            wheelMaker: [ // производитель шины
                {
                    key: 'bbs',
                    value: 'BBS'
                },
                {
                    key: 'borbet',
                    value: 'borbet'
                }
            ],
            model: [],
            diameter: [ // диаметр диска, шины
                {
                    key: '12',
                    value: '12'
                },
                {
                    key: '13',
                    value: '13'
                },
                {
                    key: '14',
                    value: '14'
                },
                {
                    key: '15',
                    value: '15'
                },
                {
                    key: '16',
                    value: '16'
                },
                {
                    key: '17',
                    value: '17'
                },
                {
                    key: '18',
                    value: '18'
                },
                {
                    key: '19',
                    value: '19'
                },
            ],
            material: [ // материал проставки
                {
                    key: 'aluminum',
                    value: 'aluminum'
                },{
                    key: 'steel',
                    value: 'steel'
                }
            ],
           wheelWidth: [ // ширина диска
                {
                    key: 'j5',
                    value: 'J5'
                },{
                    key: 'j5.5',
                    value: 'j5.5'
                },{
                   key: 'j6',
                   value: 'j6'
               },{
                   key: 'j6.5',
                   value: 'j6.5'
               },{
                   key: 'j7',
                   value: 'j7'
               },{
                   key: 'j7.5',
                   value: 'j7.5'
               }
            ],
            tyreWidth: [ // ширина шины
                {
                    key: '185',
                    value: '185'
                },{
                    key: '195',
                    value: '195'
                }
            ],
            PCD: [ // диаметр окружности точек крепежа
                {
                    key: '4x98',
                    value: '4x98'
                },{
                    key: '4x100',
                    value: '4x100'
                },{
                    key: '4x108',
                    value: '4x108'
                },{
                    key: '5x98',
                    value: '5x98'
                },{
                    key: '5x100',
                    value: '5x100'
                },{
                    key: '5x108',
                    value: '5x108'
                },{
                    key: '5x110',
                    value: '5x110'
                },{
                    key: '5x112',
                    value: '5x112'
                },{
                    key: '5x120',
                    value: '5x120'
                }
            ],
            tyreHeight: [ // высота профиля шины
                {
                    key: '40',
                    value: '40'
                },{
                    key: '45',
                    value: '45'
                },{
                    key: '50',
                    value: '50'
                },{
                    key: '55',
                    value: '55'
                },{
                    key: '60',
                    value: '60'
                },{
                    key: '65',
                    value: '65'
                }
            ]
        };
        console.log($routeParams)
        $scope.listType = $routeParams.type;
        $scope.activList = {
            wheels: '',
            tyres: '',
            spaces: ''
        }
        $scope.activList[$routeParams.type] = 'disabled';


// LIST WHEELS START
        $scope.optType      = listSelectOption.wheelType;
        $scope.optPcd       = listSelectOption.PCD;
        $scope.optMaker     = listSelectOption.wheelMaker;
        $scope.optModel     = listSelectOption.model;
        $scope.optWidth     = listSelectOption.wheelWidth;
        $scope.optDiametr   = listSelectOption.diameter;
// LIST WHEELS END

// LIST TYRES START
        $scope.optType      = listSelectOption.tyreType;
        $scope.optDiameter  = listSelectOption.diameter;
        $scope.optWidth     = listSelectOption.tyreWidth;
        $scope.optMaker     = listSelectOption.tyreMaker;
        $scope.optModel     = listSelectOption.model;
        $scope.optTyreHeight= listSelectOption.tyreHeight;
// LIST TYRES END

// LIST SPACES START
        $scope.optMaterial  = listSelectOption.material;
        $scope.optPCD       = listSelectOption.PCD;
// LIST SPACES END
    }
})();