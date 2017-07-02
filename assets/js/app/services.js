(function() {
    "use strict";

    function Service() {

        this.getLocalizator = function() {
                return window.localization_items
        };
    }

    angular
        .module('General')
        .service('Service', Service);
})()