angular.module('gear.resource', ['ngResource'])
    .factory('grResourceStatusInterceptor', function ($q) {
        return {
            request: function (config) {
                config = config || $q.when(config);

                return config;
            },
            response: function(response) {
                return response;
            },
            responseError: function (rejection) {
                return $q.reject(rejection);
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('grResourceStatusInterceptor');
    })
    .factory('grResource', function ($resource) {
        var apiPath = 'api/public/index.php';
        var ngResources = {};
        function buildNgResource (resource, name) {
            angular.forEach(resource, function (definition) {
                definition.url = apiPath+definition.url;
            });

            ngResources[name] = $resource(name, null, resource, {stripTrailingSlashes: false});
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
    })
    .factory('grResourceInfo', function ($http) {
        var apiPath = 'api/public/index.php/';

        return {
            getSchema: function (modelName, successCallback) {
                return $http.get(apiPath+'tell/'+modelName).success(function (data) {
                    successCallback(data.schema);
                });
            }
        }
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
