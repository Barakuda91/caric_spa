(function() {
    "use strict";

    function Service() {

        this.getLocalizator = function() {
            if (!window.localization_items) return;


            var currentObject = window.localization_items; //{};
            currentObject = new Proxy(currentObject, {
                get: function(target, phrase) {
                    if (phrase in target) {
                        return target[phrase];
                    } else {
                        return {ru:phrase,en:phrase,ua:phrase};
                    }
                }
            })

            return currentObject;
        };

        this.getLocalizationButton = function(lang)
        {
            var e={en:'',ru:'',ua:''}
            e[lang] = 'btn-orange';
            return e;
        };
    }

    angular
        .module('General')
        .service('Service', Service);
})()