angular.module('gear.resource', ['ngResource'])
    .factory('grResource', function ($resource) {
        var apiPath = '/api';
        var ngResources = {};

        function buildNgResource (resource, type) {
            angular.forEach(resource, function (definition) {
                definition.url = apiPath+definition.url;
            });
            ngResources[type] = $resource(type, null, resource, {stripTrailingSlashes: false})
        }

        function buildNgResources() {
            angular.forEach(GearResource.list(), function (resource, type) {
                buildNgResource(resource, type);
            });
        }

        function getNgResource(name) {
            return ngResources[name];
        }

        GearResource.on('register', buildNgResources);
        buildNgResources();

        return function (resourceName) {
            return getNgResource(resourceName);
        };
    });

window.GearResource = (function () {
    var resources = {};
    var events = [];
    function publish (eventName) {
        for (var i=0; i<events.length; i++) {
            if (events[i].name == eventName) {
                events[i].callback();
            }
        }
    }
    function subscribe (eventName, callback) {
        events.push({name: eventName, callback: callback});
    }

    return {
        register: function (r) {
            resources = r;
            publish('register');
        },
        on: function (eventName, callback) {
            subscribe(eventName, callback);
        },
        list: function () {
            return resources;
        }
    }
})();
