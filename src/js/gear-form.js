(function (angular) {
'use strict';

angular.module('gear.form', ['gear.resource', 'gear.helper', 'gear.validator', 'gear.decorator'])
    .directive('grInputDate', InputDirectiveFactory('date'))
    .directive('grInputTime', InputDirectiveFactory('time'))
    .directive('grInputDatetime', InputDirectiveFactory('datetime'))
    .directive('grInputMoney', InputDirectiveFactory('float', {decimal:2}))
    .directive('grInputBigString', InputDirectiveFactory('textarea'))
    .directive('grInputString', InputDirectiveFactory('text'))
    .directive('grForm', function (gr, grNote) {
        var formNumber = 0;
        var templates = {
            ngForm: '<div class="row-border {{grFormClassName}}">' +
                '<gr-form-messages></gr-form-messages>' +
                '<form name="{{grFormName}}">' +
                    '<gr-form-field ng-repeat="grDefinition in grDataDefinitions" ng-if="isEditable(grDefinition)"></gr-form-field>' +
                    '<gr-form-actions></gr-form-actions>' +
                '</form>' +
            '</div>'
        };

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            template: templates.ngForm,
            controller: function ($scope, $element, $attrs) {
                $scope.grData = $scope.data;
                $scope.$watch('data', function () {
                    $scope.grData = $scope.data;
                }, true);
                $scope.grDataDefinitions = $scope.dataDefinitions;
                $scope.$watch('dataDefinitions', function () {
                    $scope.grDataDefinitions = $scope.dataDefinitions;
                }, true);
                $scope.grFormName = 'form' + formNumber++;
                $scope.grFormClassName = $attrs.type || 'form-horizontal';
                $scope.isEditable = function (definition) {
                    return !definition.guarded && definition.type !== 'auto_increment';
                };

            },
            link: function (scope, element, attrs, ctrl, transclude) {
                scope.grForm = scope[scope.grFormName];
                scope.grFormNote = new grNote('alert-box', element);

                transclude(scope, function (tElements) {
                    element.append(tElements);
                });
            }
        }
    })
    .directive('grFormField', function (dom, arr, field, $compile) {
        var labelTemplate = '<gr-form-label name="{{grFieldName}}" class="col-sm-2">{{grFieldLabel}}</gr-form-label>';
        var inputGroupTemplate = '<div class="col-sm-10"></div>';

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            template: '<div class="form-group" ng-class="{\'has-error\': grForm[grFieldName].$invalid}"></div>',
            link: function (scope, formGroupElement, attrs) {
                scope.grFieldName = field.getName(attrs, scope);
                scope.grFieldLabel = field.getLabel(attrs, scope);

                var formLabel = angular.element(labelTemplate);
                $compile(formLabel)(scope);

                formGroupElement.append(formLabel);

                var inputField = field.createDirectiveFromType(field.getType(attrs, scope), {
                    name: 'grFieldName',
                    model: 'grData[grFieldName]',
                    fieldCtrl: 'grForm[grFieldName]'
                });
                $compile(inputField)(scope);

                var inputGroup = angular.element(inputGroupTemplate);
                inputGroup.append(inputField);

                formGroupElement.append(inputGroup);
            }
        }
    })
    .directive('grFormMessages', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div ng-if="grFormNote.pasted"></div>'
        }
    })
    .directive('grFormFieldMessages', function () {
        return {
            restrict: 'E',
            scope: {
                messages: '=',
                ctrl: '='
            },
            template: '<div><span class="help-block" ng-repeat="(key, value) in ctrl.$error" ng-show="ctrl.$dirty && ctrl.$error[key]">' +
                '{{messages[key]}}' +
                '</span></div>'
        }
    })
    .directive('grFormLabel', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                name: '@'
            },
            template: '<label class="control-label" for="{{name}}" ng-transclude></label>'
        }
    })
    .directive('grFormActionButton', function (dom, grNote, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                action: '&'
            },
            template: '<button class="btn gr-btn-action" ng-class="{loading:loading}" ng-click="act()">' +
                '<span class="gr-btn-label" ng-transclude></span>' +
                '<span class="gr-btn-spinner"></span></button>',
            link: function (scope, element) {
                scope.loading = false;

                var note = new grNote();

                function start () {
                    scope.loading = true;
                    note.loading();
                    dom.disable(element);
                }
                function done () {
                    scope.loading = false;
                    note.erase();
                    dom.enable(element);
                }

                function error (r) {
                    note.error();
                    $timeout(done, 1000);
                }
                function success () {
                    $timeout(done, 500);
                }

                scope.act = function () {
                    start();
                    scope.action().then(success).catch(error);
                };
            }
        }
    })
    .directive('grFormActions', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            template: '<div class="form-actions"></div>',
            controller: function ($scope) {
                $scope.grDo = function (action) {
                    var resourceAction = '$'+action;
                    if (!angular.isFunction($scope.grData[resourceAction])) {
                        throw 'Calling undefined function grData.'+resourceAction+'()';
                    }

                    var response = $scope.grData[resourceAction]();
                    response.catch(function (error) {
                        $scope.grFormNote.error(error.data);
                    })
                    return response;
                };
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                transclude(scope, function (tElements) {
                    if (!tElements.length) {
                        var actionButton = angular.element('<gr-form-action-button>');
                        actionButton.addClass('btn-primary pull-right');
                        actionButton.attr('type', 'submit');
                        actionButton.attr('action', 'grDo(\'save\')');
                        actionButton.html('Submit');
                        $compile(actionButton)(scope);
                        element.append(actionButton);
                    }
                });
            }
        }
    });

    function InputDirectiveFactory (type, args) {
        function createInput (tagName, attrs, type) {
            var input = angular.element('<'+tagName+'>');
            if (!type) {
                input.attr('type', 'text');
            }
            input.attr('name', attrs.name);
            input.attr('ng-required', true);
            input.attr('ng-model', 'model');
            input.attr('ng-model-options', "{updateOn:\'blur\'}");
            input.addClass('form-control');

            return input;
        }

        function createMessages (attrs) {
            var messages = angular.element('<gr-form-field-messages>');
            messages.addClass('help-block');
            messages.attr('ctrl', 'fieldCtrl');
            messages.attr('messages', angular.toJson({
                required: 'This field is required'
            }));

            return messages;
        }

        function extendBase (settings) {
            return angular.extend({
                restrict: 'E',
                scope: {
                    name: '@',
                    model: '=',
                    fieldCtrl: '='
                },
                template: '<div></div>'
            }, settings);
        }

        var directives = {
            text: function () {
                return extendBase({
                    compile: function (elm, attrs) {
                        elm.append(createInput('input', attrs));
                        elm.append(createMessages(attrs));
                    }
                });
            },
            textarea: function () {
                return extendBase({
                    compile: function (elm, attrs) {
                        elm.append(createInput('textarea', attrs));
                        elm.append(createMessages(attrs));
                    }
                });
            },
            float: function (mat) {
                return extendBase({
                    compile: function (elm, attrs) {
                        elm.append(createInput('input', attrs));
                        elm.append(createMessages(attrs));

                        return function (scope) {
                            scope.$watch('model', function () {
                                scope.model = scope.model ? mat.numberFormat(scope.model, args.decimal) : null;
                            })
                        }
                    }
                });
            },
            datetime: function () {
                return extendBase({
                    template: '<div class="row">' +
                        '<div class="col-sm-7"><gr-input-date model="date"></gr-input-date></div>' +
                        '<div class="col-sm-5"><gr-input-time model="time"></gr-input-time></div>' +
                        '<input type="hidden" ng-model="model" />' +
                        '</div>',
                    link: function (scope, element, attrs) {
                        //gr.appendInputValidations(scope, element.find('input[type=hidden]'));

                        scope.$watch('date', function () {
                            if (scope.time) {
                                scope.model = scope.date + ' ' + scope.time;
                            }
                        });
                        scope.$watch('time', function () {
                            if (scope.date) {
                                scope.model = scope.date + ' ' + scope.time;
                            }
                        });
                    }
                });
            },
            date: function () {
                return extendBase({
                    template: '<div class="input-group">' +
                        '<input type="text" class="form-control" placeholder="Select a date" />' +
                        '<input type="hidden" ng-model="model" ng-model-options="{updateOn:\'blur\'}" />' +
                        '<span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>' +
                        '</div>',
                    link: function (scope, element) {
                        var dateInput = element.find('input[type=text]');

                        //gr.appendInputValidations(scope, element.find('input[type=hidden]'));

                        function onSet(e) {
                            if (scope.$$phase || scope.$root.$$phase) // we are coming from $watch or link setup
                                return;

                            if (e.hasOwnProperty('clear')) {
                                scope.model = null;
                                return;
                            }
                            scope.model = dateInput.pickadate('picker').get('select', 'yyyy-mm-dd');
                            scope.$apply();
                        }

                        dateInput.pickadate({
                            format: 'd mmmm, yyyy',
                            editable: false,
                            onSet: onSet,
                            container: document.body
                        });
                    }
                });
            },
            time: function () {
                return extendBase({
                    template: '<div class="input-group">' +
                        '<input type="text" class="form-control" placeholder="Select a time" />' +
                        '<input type="hidden" ng-model="model" ng-model-options="{updateOn:\'blur\'}" />' +
                        '<span class="input-group-addon"><i class="fa fa-clock-o"></i></span>' +
                        '</div>',
                    link: function (scope, element) {
                        var timeInput = element.find('input[type=text]');

                        //gr.appendInputValidations(scope, element.find('input[type=hidden]'));

                        function onSet(e) {
                            if (scope.$$phase || scope.$root.$$phase) // we are coming from $watch or link setup
                                return;

                            if (e.hasOwnProperty('clear')) {
                                scope.model = null;
                                return;
                            }
                            scope.model = timeInput.pickatime('picker').get('select', 'HH:i:00');
                            scope.$apply();
                        }

                        timeInput.pickatime({
                            format: 'h:i a',
                            editable: false,
                            onSet: onSet,
                            container: document.body
                        });
                    }
                });
            }
        };

        return directives[type];
    }

})(angular);