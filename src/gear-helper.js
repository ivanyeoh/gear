angular.module('gear.helper', [])
    .factory('str', function () {
        return _.str;
    })
    .factory('arr', function () {
        return _;
    })
    .factory('dom', function (arr) {
        return {
            createElement: function (name, attrs) {
                var element = angular.element('<'+name+'>');

                if (!attrs) return element;

                angular.forEach(attrs, function (value, key) {
                    if (!key.match(/^\$/)) {
                        element.attr(key, angular.isObject(value) ? angular.toJson(value) : value);
                    }
                });
                return element;
            },
            isLabel: function (element) {
                return element.tagName && element.tagName.toLowerCase() === 'label'
            },
            isText: function (element) {
                return element.nodeType && element.nodeType === document.TEXT_NODE;
            }
        }
    })
    .factory('mat', function () {
        return {
            numberFormat: function (number, decimal) {
                var pow = Math.pow(10, decimal);
                return Math.floor(number * pow) / pow;
            }
        }
    })
    .factory('field', function (str) {
        return {
            getDirectiveName: function (attrs) {
                return 'gr-input-'+str.dasherize(attrs.type);
            },
            hasLabel: function (attrs) {
                return attrs.label || attrs.name;
            },
            getLabel: function (attrs) {
                return attrs.label || str.humanize(attrs.name);
            }
        }
    });