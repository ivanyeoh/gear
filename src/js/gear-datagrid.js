angular.module('gear.datagrid', [])
    .directive('grDatagrid', function (dom, $compile, arr, field, str) {
        function relocateDirective (from, to, tagName) {
            if (from.length) {
                var toElement = angular.element('<'+tagName+'>');
                toElement.html(from.html());
                to.append(toElement);
            }
        }

        function makeHeader (label) {
            return angular.element('<span>').append(label);
        }

        function makeColumn (columnName) {
            return angular.element('<span>{{row.'+columnName+'}}</span>');
        }

        function buildFromElement (headContainer, bodyContainer, defElement, scope) {
            var definition = angular.element(defElement);
            var headerContents = definition.find('gr-datagrid-head');
            var bodyContents = definition.find('gr-datagrid-body');
            var itemAttrs = dom.getAttributes(defElement);
            var itemName = field.getName(itemAttrs, scope);
            itemName = itemName || str.grep(dom.getTagName(defElement), /^gr-datagrid-(\w+)/);

            if (headerContents.length === 0) {
                var label = field.getLabel(itemAttrs, scope);
                label = label || str.humanize(itemName);
                headerContents = makeHeader(label);
            }

            if (bodyContents.length === 0) {
                bodyContents = makeColumn(itemName);
            }

            relocateDirective(headerContents, headContainer, 'th');
            relocateDirective(bodyContents, bodyContainer, 'td');
        }

        function buildFromJson (headContainer, bodyContainer, jDefinition, scope) {
            var headerContents = makeHeader(field.getLabel(jDefinition, {
                grDefinition: jDefinition
            }));
            var bodyContents = makeColumn(jDefinition.field);
            relocateDirective(headerContents, headContainer, 'th');
            relocateDirective(bodyContents, bodyContainer, 'td');
        }

        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            template: '<table class="table"><thead><tr></tr></thead><tbody><tr></tr></tbody></table>',
            link: function (scope, element, attrs, ctrl, transclude) {
                scope.grData = scope.resource.query();

                var headContainer = element.find('thead tr');
                var bodyContainer = element.find('tbody tr');

                bodyContainer.attr('ng-repeat', 'row in grData');

                transclude(scope, function (tElements) {
                    var customDefinitions = arr.filter(tElements, function (tElement) {
                        return dom.hasTagNameMatch(tElement, /^gr-datagrid/);
                    });
                    var actionDefinitions = arr.remove(customDefinitions, function (customDefinition) {
                        return dom.hasTagName(customDefinition, 'gr-datagrid-actions');
                    });
                    if (customDefinitions.length) {
                        angular.forEach(customDefinitions, function (customDefinition) {
                            buildFromElement(headContainer, bodyContainer, customDefinition, scope);
                        });

                        $compile(element.contents())(scope);
                    }
                    scope.$watch('dataDefinitions', function () {
                        if (scope.dataDefinitions && scope.dataDefinitions.length && !customDefinitions.length) {
                            angular.forEach(scope.dataDefinitions, function (definition) {
                                buildFromJson(headContainer, bodyContainer, definition, scope);
                            });
                            $compile(element.contents())(scope);
                        }
                    });

                });
            }
        }
    })