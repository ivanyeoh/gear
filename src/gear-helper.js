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
    .factory('field', function (str, dom) {
        function resolveAttr (attrs, scope, aName, dName) {
            if (attrs[aName]) {
                return attrs[aName];
            }

            if (scope.grDefinition && scope.grDefinition[dName||aName]) {
                return scope.grDefinition[dName||aName];
            }
        }

        return {
            resolveName: function (attrs, scope) {
                return resolveAttr(attrs, scope, 'name', 'field');
            },
            resolveLabel: function (attrs, scope) {
                return resolveAttr(attrs, scope, 'label');
            },
            resolveType: function (attrs, scope) {
                return resolveAttr(attrs, scope, 'type');
            },
            createDirectiveFromType: function (type, attrs) {
                return dom.createElement('gr-input-'+str.dasherize(type), attrs);
            },
            hasLabel: function (attrs, scope) {
                return this.resolveLabel(attrs, scope) || this.resolveName(attrs, scope);
            },
            getLabel: function (attrs, scope) {
                return this.resolveLabel(attrs, scope) || str.humanize(this.resolveName(attrs, scope));
            },
            getName: function (attrs, scope) {
                return this.resolveName(attrs, scope);
            },
            getType: function (attrs, scope) {
                return this.resolveType(attrs, scope);
            }
        }
    });