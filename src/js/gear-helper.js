angular.module('gear.helper', [])
    .factory('gr', function (arr, str, $injector, $compile) {
        return {
            setDefaultValue: function (obj, key, value) {
                if (angular.isUndefined(obj[key])) obj[key] = value;
            },
            hasDirective: function (directiveName) {
                return $injector.has(str.camelize(directiveName+'-directive'));
            },
            ensureDirectiveExists: function (directiveName) {
                if (!this.hasDirective(directiveName)) {
                    throw 'Directive "'+directiveName+'" is not exists';
                }
            },
            appendInputValidations: function (scope, element) {
                var gr = this;

                if (!scope.validations) {
                    return;
                }

                arr.forEach(scope.validations, function (validation) {
                    gr.ensureDirectiveExists('validate-'+validation.type);
                    element.attr('validate-'+str.dasherize(validation.type), angular.toJson(validation));
                });

                $compile(element)(scope);
            }
        }
    })
    .factory('str', function () {
        _.str.grep = function (s, pattern) {
            var match = s.match(pattern);
            return match ? match[1] : '';
        };
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
            disable: function (element) {
                element.prop('disabled', true);
            },
            enable: function (element) {
                element.removeAttr('disabled');
            },
            hasTagName: function (element, tagName) {
                return this.getTagName(element) === tagName;
            },
            hasTagNameMatch: function (element, regExpPattern) {
                return this.getTagName(element).match(regExpPattern) ? true : false;
            },
            getTagName: function (element) {
                return element.tagName ? element.tagName.toLowerCase() : '';
            },
            isLabel: function (element) {
                return element.tagName && element.tagName.toLowerCase() === 'label'
            },
            isText: function (element) {
                return element.nodeType && element.nodeType === document.TEXT_NODE;
            },
            getAttributes: function (element) {
                var attributes = {};
                for (var att, i = 0, atts = element.attributes, n = atts.length; i < n; i++){
                    att = atts[i];
                    attributes[att.nodeName] = att.value || nodeValue;
                }
                return attributes;
            },
            hasContent: function (element) {
                return (element.innerHTML || element.innerText || element.textContent).trim() ? true : false;
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

            return '';
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