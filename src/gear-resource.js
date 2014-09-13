window.GearResource = (function () {
    var resources = {};

    return {
        register: function (r) {
            resources = r;
        },
        all: function () {
            return resources;
        }
    }
})();

angular.module('gear.resource', [])
    .factory('grResource', function ($resource) {
        var resources = GearResource.all();

        var ngResources = {};
        angular.forEach(resources, function (resource, type) {
            ngResources[type] = $resource('/NO-DEFAULT', null, resource, {stripTrailingSlashes: false})
        });

        return function (resourceName) {
            if (!angular.isDefined(ngResources[resourceName])) throw 'Resource ['+resourceName+'] is not registered';

            return ngResources[resourceName];
        };
    });