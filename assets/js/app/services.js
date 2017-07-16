(function() {
    "use strict";
    var name = 'Service';
    var $log = angular.injector(['ng']).get('$log');
    var $timeout = angular.injector(['ng']).get('$timeout');
    function Service() {

        this.modal = function($rootScope, options) {
            $log.debug(name+'.modal')
            /*закрываем модалку*/
            if(!options) {
                $rootScope.modals.shadow = false;
                return;
            }

            /*устанавливаем модалку*/
            if(options.template) {
                var temptlateUrl = '/templates/modals/'+options.template+'.html';
            } else {
                $log.error('options.template is require');
                return;
            }

            $rootScope.modals = {
                window: true,
                content: temptlateUrl,
                header: options.header || false,
                crossButton: options.crossButton || true,
                size: options.size || 'lg'
            };
            $rootScope.modals.shadow = true;
            $rootScope.$digest();
            if(typeof options.delay == 'number') {
                $timeout(function () {
                    $rootScope.modals.shadow = false;
                    $rootScope.$digest();
                }, options.delay)
            }
        };

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

        // возаращает массив параметров [parameter], модифицированный если нужно
        this.getSettingParameter = function(parameter,disabled) {
            disabled = disabled || true;

            if(typeof parameter[0] === 'string' ) {
                parameter = parameter.map(function (el) {
                    return {
                        title: el,
                        key: el
                    }
                })
            }

            if(disabled) {
                parameter.unshift({title: 'PLEASE_SELECT', disabled: true, key: 'def_select'});
            }
            return parameter;
        };

        this.getDefaultSettingParamsValues = function(settingParams, defaultValues, useSettingParams) {
            $log.debug(name+'.getDefaultSettingParamsValues');
            defaultValues    = defaultValues    || {};
            useSettingParams = useSettingParams || true;
            var return_      = {};
            delete settingParams.defaultSelected;

            for(var setting in settingParams) {
                var defEl = '';

                if(settingParams[setting][1]) {
                    defEl = (settingParams[setting][1].key) ? settingParams[setting][1].key : settingParams[setting][1];
                }
                return_[setting] = (useSettingParams && defaultValues[setting]) ? defaultValues[setting] : defEl;
            }
console.log(return_)
            return return_;
        };

        this.formatAdvertUrl = function (obj) {
            var formattedUrl = '/post/show/';
            if (obj.id && obj.params) {
                for (var key in obj.params) {
                    if (obj.params[key]) {
                        var temp = obj.params[key];
                        temp = temp.split('_').join('-');
                        temp = temp.split(' ').join('-');
                        formattedUrl += temp + '-';
                    }
                }
                formattedUrl += obj.id;
            }

            return formattedUrl;
        }
    }

    angular
        .module('General')
        .service('Service', Service);
})()