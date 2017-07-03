(function() {
    "use strict";

    function Service() {

        this.getLocalizator = function() {
                return window.localization_items
        };

        this.getLocalizationButton = function(lang)
        {
            var e={en:'',ru:'',ua:''}
            e[lang] = 'btn-success';
            return e;
        };
    }

    angular
        .module('General')
        .service('Service', Service);
})()