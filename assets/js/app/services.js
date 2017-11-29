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
                case 'success': $rootScope.modals.statusIcon = 'fa-check fa-3x green'; break;
                case 'error': $rootScope.modals.statusIcon = 'fa-ban fa-3x red'; break;
            }
            $rootScope.modals.shadow = true;
            if(!$rootScope.$$phase) {
                $rootScope.$digest();
            }

            if(typeof options.delay == 'number') {
                $timeout(function () {
                    if($rootScope.modals) {
                        delete $rootScope.modals;
                        if(!$rootScope.$$phase) {
                            $rootScope.$digest();
                        }
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
            } else if(parameter.length === 0 ) {
                return;
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
                if(settingParams[setting].length > 0) {
                    var defEl = '';
                    if (settingParams[setting][1]) {
                        defEl = (settingParams[setting][1].key) ? settingParams[setting][1].key : settingParams[setting][1];
                    }

                    if (typeof settingParams[setting] == 'string') {
                        return_[setting] = settingParams[setting];
                    } else {
                        return_[setting] = (useSettingParams && defaultValues[setting]) ? defaultValues[setting] : settingParams[setting][0].key;
                    }
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

                    case 'tyres':
                        title = [obj.tyreWidth, obj.tyreHeight, obj.diameter].join(' ');
                        break;

                    case 'spaces':
                        title = [obj.pcdSpacesFrom, obj.pcdSpacesTo, obj.spacesWidth].join(' ');
                        break;
                }
            }

            return title;
        },

        this.allignImageInBlock = function (currentWidth, originData) {
            if (originData) {
                if (currentWidth > 1400) {
                    var imgHeight = Math.round(575 * originData.h / originData.w);
                } else {
                    var imgHeight = Math.round(555 * originData.h / originData.w);
                }
            } else {
                var imgHeight = angular.element('img.main-image-center:visible').height();
            }

            var offset = Math.round(parseInt((500 - imgHeight) / 2));
            if (currentWidth > 1200) {
                angular.element('img.main-image-center').closest('ul').css('margin-top', offset + 'px');
            } else {
                angular.element('img.main-image-center').closest('ul').css('margin-top', '0');
            }
        },

        this.validateUserSettings = function (data) {
            var result = {
                password: true
            };
            if (data) {
                /* валидация полей формы */
                if (data.password != data.confirm_password) {
                    result.password = false;
                }
                if (data.password && data.password.length < 6) {
                    result.password = false;
                }
            }

            return result;
        }
    }

    angular
        .module('General')
        .service('Service', Service);
})()