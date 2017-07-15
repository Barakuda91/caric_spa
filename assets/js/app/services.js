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
        
        this.getDefaultSettingParamsValues = function(settingParams, defaultValues, useSettingParams) {
            $log.debug(name+'.getDefaultSettingParamsValues');
            defaultValues = defaultValues || {}
            if (!useSettingParams) {
                for(var setting in settingParams) {
                    //settingParams[setting] = '';
                }
            }
console.log(settingParams)

            return {
                advertType:     defaultValues.advertType    || settingParams.advertType[0].key,
                currency:       defaultValues.currency      || settingParams.currency[0].key,
                productionYear: defaultValues.productionYear|| settingParams.productionYear[15],
                pcd:            defaultValues.pcd           || settingParams.pcd[4],
                pcdSpacesFrom:  defaultValues.pcdSpacesFrom || settingParams.pcd[6],
                pcdSpacesTo:    defaultValues.pcdSpacesTo   || settingParams.pcd[8],
                diameter:       defaultValues.diameter      || settingParams.diameter[0],
                material:       defaultValues.material      || settingParams.material[0].key,
                tyreType:       defaultValues.tyreType      || settingParams.tyreType[0].key,
                tyreHeight:     defaultValues.tyreHeight    || settingParams.tyreHeight[0],
                tyreWidth:      defaultValues.tyreWidth     || settingParams.tyreWidth[0],
                tyreSpeedIndex: defaultValues.tyreSpeedIndex|| settingParams.tyreSpeedIndex[0],
                tyreLoadIndex:  defaultValues.tyreLoadIndex || settingParams.tyreLoadIndex[0],
                //tyreMaker:    defaultValues.tyreMaker     || settingParams.tyreMaker[0].key,
                //tyreModel:    defaultValues.tyreModel     || settingParams.tyreModel[0].key,
                wheelType:      defaultValues.wheelType     || settingParams.wheelType[0].key,
                wheelWidth:     defaultValues.wheelWidth    || settingParams.wheelWidth[0],
                //wheelMaker:   defaultValues.wheelMaker    || settingParams.wheelMaker[0].key,
                //wheelModel:   defaultValues.wheelModel    || settingParams.wheelModel[0].key
                spacesType:     defaultValues.spacesType    || settingParams.spacesType[0].key,
                fastenersType:  defaultValues.fastenersType || settingParams.fastenersType[0].key,
                price:              defaultValues.price     || '',
                centerHole:         defaultValues.centerHole|| '',
                offset:             defaultValues.offset    || '',
                advertPhoneNumber:  defaultValues.advertPhoneNumber || '',
                advertDescription:  defaultValues.advertDescription || '',
                treadRest_1:        defaultValues.treadRest_1       || '',
                treadRest_2:        defaultValues.treadRest_2       || '',
                spacesCenterHole:   defaultValues.spacesCenterHole  || ''
                // advertDeliveryMethod:   defaultValues.advertDeliveryMethod || settingParams.advertDeliveryMethod[0].key,
            }
        }
    }

    angular
        .module('General')
        .service('Service', Service);
})()