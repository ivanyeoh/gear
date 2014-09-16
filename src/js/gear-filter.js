angular.module('gear.filter', [])
    .filter('capitalize', function(str) {
        return function(input) {
            return str.capitalize(input || '');
        };
    });