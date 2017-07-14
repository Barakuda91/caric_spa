(function() {
    "use strict";
    var name = 'Service';
    var $log = angular.injector(['ng']).get('$log');
    function Service() {

        this.getLocalizator = function($rootScope) {
            $log.debug(name+'.getLocalizator');

            if (!window.localization_items) return;
            var currentObject = window.localization_items;
            currentObject = new Proxy(currentObject, {
                get: function(target, phrase) {
                    if (phrase in target) {
                        return (function($rootScope){
                            if (typeof target[phrase][$rootScope.lang] == 'undefined') {
                                return phrase;
                            } else {
                                return target[phrase][$rootScope.lang].charAt(0).toUpperCase() + target[phrase][$rootScope.lang].slice(1);
                            }
                        })($rootScope);
                    } else {
                        return phrase;
                    }
                }
            });

            return currentObject;
        };

        this.getLocalizationButton = function(lang) {
            $log.debug(name+'.getLocalizationButton');

            var e={en:'',ru:'',ua:''}
            e[lang] = 'btn-orange';
            return e;
        };
        
        this.getDefaultSettingParamsValues = function(settingParams) {
            $log.debug(name+'.getDefaultSettingParamsValues');

            return {
                advertType:     settingParams.advertType[0].key,
                currency:       settingParams.currency[0].key,
                productionYear: settingParams.productionYear[15],
                pcd:            settingParams.pcd[4],
                pcdSpacesFrom:  settingParams.pcd[6],
                pcdSpacesTo:    settingParams.pcd[8],
                diameter:       settingParams.diameter[0],
                material:       settingParams.material[0].key,
                tyreType:       settingParams.tyreType[0].key,
                tyreHeight:     settingParams.tyreHeight[0],
                tyreWidth:      settingParams.tyreWidth[0],
                tyreSpeedIndex: settingParams.tyreSpeedIndex[0],
                tyreLoadIndex:  settingParams.tyreLoadIndex[0],
                //tyreMaker:    settingParams.tyreMaker[0].key,
                //tyreModel:    settingParams.tyreModel[0].key,
                wheelType:      settingParams.wheelType[0].key,
                wheelWidth:     settingParams.wheelWidth[0],
                //wheelMaker:   settingParams.wheelMaker[0].key,
                //wheelModel:   settingParams.wheelModel[0].key
                spacesType:     settingParams.spacesType[0].key,
                fastenersType:  settingParams.fastenersType[0].key,
                // advertDeliveryMethod:   settingParams.advertDeliveryMethod[0].key,
                price:              '',
                advertPhoneNumber:  '',
                advertDescription:  '',
                centerHole:         '',
                offset:             '',
                treadRest_1:        '',
                treadRest_2:        '',
                spacesCenterHole:   ''
            }
        }
    }

    angular
        .module('General')
        .service('Service', Service);
})()