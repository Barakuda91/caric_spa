(function() {
    "use strict";
    var name = 'Service';
    var defaultParameterKeyName = 'def_select';
    var $log = angular.injector(['ng']).get('$log');
    var $timeout = angular.injector(['ng']).get('$timeout');
    function Service() {

        this.modal = function($rootScope, options) {
            $log.debug(name+'.modal')
            /*закрываем модалку*/
            if(!options) {
                delete $rootScope.modals;

//                $rootScope.modals.shadow = false;
                return;
            }

            $rootScope.modals = {
                window: true,
                header: options.header || false,
                crossButton: options.crossButton || false,
                okButton: options.okButton || false,
                size: options.size || 'lg'
            };

            /*устанавливаем модалку*/
            if(options.template) {
                $rootScope.modals.content = '/templates/modals/'+options.template+'.html';
            }


            switch(options.status) {
                case 'success': $rootScope.modals.statusIcon = 'fa-thumbs-o-up fa-3x green'; break;
                case 'error': $rootScope.modals.statusIcon = 'fa-thumbs-o-down fa-3x red'; break;
            }
            $rootScope.modals.shadow = true;
            $rootScope.$digest();

            if(typeof options.delay == 'number') {
                $timeout(function () {
                    if($rootScope.modals) {
                        delete $rootScope.modals;
                        $rootScope.$digest();
                    }
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
                            if (typeof target[phrase][$rootScope.userData.language] == 'undefined') {
                                return phrase;
                            } else {
                                return target[phrase][$rootScope.userData.language].charAt(0).toUpperCase() + target[phrase][$rootScope.userData.language].slice(1);
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

            if(typeof disabled == 'undefined') {
                disabled = true;
            }

            if(typeof parameter[0] === 'string' ) {
                parameter = parameter.map(function (el) {
                    return {
                        title: el,
                        key: el
                    }
                })
            }

            if(disabled) {
                parameter.unshift({title: 'PLEASE_SELECT', disabled: true, key: defaultParameterKeyName});
            }
            return parameter;
        };

        this.getDefaultSettingParamsValues = function(settingParams, defaultValues, useSettingParams) {
            $log.debug(name+'.getDefaultSettingParamsValues');
            defaultValues    = defaultValues    || {};
            useSettingParams = useSettingParams || true;
            var return_      = {};

            for(var setting in settingParams) {
                var defEl = '';
                if(settingParams[setting][1]) {
                    defEl = (settingParams[setting][1].key) ? settingParams[setting][1].key : settingParams[setting][1];
                }

                if(typeof settingParams[setting] == 'string') {
                    return_[setting] = settingParams[setting];
                } else {
                    return_[setting] = (useSettingParams && defaultValues[setting]) ? defaultValues[setting] : settingParams[setting][0].key;
                }
            }
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
        },

        this.createAdvertTitleByType = function (obj) {
            var title;
            if (obj.advertType) {
                switch (obj.advertType) {
                    case 'wheels':
                        title = [obj.pcd, obj.diameter, obj.wheelWidth].join(' ');
                        break;

                    case 'tires':
                        break;

                    case 'spacers':
                        break;
                }
            }

            return title;
        }
    }

    angular
        .module('General')
        .service('Service', Service);
})()