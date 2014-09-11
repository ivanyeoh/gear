(function (angular) {
    'use strict';

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
            var messages = angular.element('<gr-messages>');
            messages.addClass('help-block');
            messages.attr('form', 'form');
            messages.attr('messages', angular.toJson({
                required: 'This field is required'
            }));

            return messages;
        }

        function extendBase (settings) {
            return angular.extend({
                restrict: 'E',
                scope: {
                    model: '=',
                    form: '='
                },
                template: '<span></span>'
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
                            scope.model = dateInput.pickadate('picker').get('select', 'yyyy/mm/dd');
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
                            scope.model = timeInput.pickatime('picker').get('select', 'HH:i');
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


    angular.module('gear.form', ['gear.helper', 'gear.validator', 'ngMessages'])
        .directive('grWidget', function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    header: '@'
                },
                template: '<div class="widget box">' +
                    '<div class="widget-header"><h4><i class="icon-reorder"></i> {{ header }}</h4></div>' +
                    '<div class="widget-content" ng-transclude></div>' +
                    '</div>'
            }
        })
        .directive('grFormOld', function (gr, arr, $compile, str, $injector) {
            return {
                restrict: 'E',
                replace: true,
                template: '<ng-form name="form" class="form-horizontal"></ng-form>',
                link: function (scope, element) {

                    if (scope.dataDefinitions) {
                        arr.forEach(scope.dataDefinitions, function (definition) {
                            var inputDirectiveName = 'gr-input-' + definition.type;
                            gr.ensureDirectiveExists(inputDirectiveName);

                            var validationJson = angular.toJson(definition.validations);
                            var inputDirective = angular.element('<' + inputDirectiveName + '>');
                            inputDirective.attr('id', definition.field);
                            inputDirective.attr('name', definition.field);
                            inputDirective.attr('field-type', definition.type);
                            inputDirective.attr('validations', validationJson);
                            inputDirective.attr('model', 'data.' + definition.field);

                            var formGroup = angular.element('<gr-form-group>');
                            formGroup.attr('name', definition.field);
                            formGroup.attr('label', str.humanize(definition.field));
                            formGroup.attr('field-type', definition.type);
                            formGroup.attr('validations', validationJson);
                            formGroup.attr('form', 'form');
                            formGroup.append(inputDirective);

                            element.append(formGroup);
                        });
                    }

                    $compile(element)(scope);
                }
            }
        })
        .directive('grForm', function (dom, arr, gr, $compile) {
            var i = 0;

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: true,
                template: '<div></div>',
                compile: function (tElm, tAttr) {
                    var formType = tAttr.type || 'form-horizontal';
                    tElm.addClass(formType);

                    var aForm = dom.createElement('ng-form');
                    var formName = 'form' + i++;
                    aForm.attr('name', formName);
                    tElm.append(aForm);

                    return function (scope, elm, attrs, ctrl, transclude) {
                        scope.formCtrl = scope[formName];
                        var formElement = elm.find('[name='+formName+']');

//                        if (scope.dataDefinitions) {
//                            arr.forEach(scope.dataDefinitions, function (definition) {
//                                var inputField = dom.createElement('gr-form-field', {
//                                    'name': definition.field,
//                                    'label': definition.label,
//                                    'type': definition.type
//                                });
//                                formElement.append(inputField);
//                            });
//
//                            $compile(elm)(scope);
//                        }

                        transclude(scope, function (tElements) {
                            aForm.append(tElements);
                        });
                    }
                }
            }
        })
        .directive('grFormGroup', function (dom, arr, field, $compile) {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<div class="form-group" ng-class="{\'has-error\': form.$dirty && form.$invalid}"></div>',
                link: function (scope, formGroupElement, attrs, ctrl, transclude) {
                    console.log(attrs.form);
                    transclude(scope, function (tElements) {
                        var noLabel = false;
                        var formLabel = arr.remove(tElements, function (tElement) {
                            return dom.isLabel(tElement)
                        });
                        if (!formLabel.length) {
                            if (field.hasLabel(attrs)) {
                                formLabel = dom.createElement('gr-form-label');
                                formLabel.addClass('col-sm-2');
                                formLabel.html(field.getLabel(attrs));
                                $compile(formLabel)(scope);
                                formGroupElement.append(formLabel);
                            }
                            else {
                                noLabel = true;
                            }
                        }

                        var inputDiv = dom.createElement('div', {
                            'class': 'control-input'+(noLabel ? ' col-sm-12' : ' col-sm-10')
                        });
                        inputDiv.append(tElements);

                        formGroupElement.append(inputDiv);
                    });
                }
            }
        })
        .directive('grFormLabel', function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                template: '<label class="control-label" ng-transclude></label>',
                compile: function (elm, attrs) {
                    if (attrs.className) {
                        elm.addClass(attrs.className);
                    }
                }
            }
        })
        .directive('grFormField', function (field, dom) {
            return {
                restrict: 'E',
                replace: true,
                template: '<div></div>',
                compile: function (elm, attrs) {
                    attrs.type = attrs.type || 'string';

                    var formGroup = dom.createElement('gr-form-group');
                    formGroup.attr('label', field.getLabel(attrs));
                    formGroup.attr('form', 'formCtrl.'+attrs.name);

                    var formInput = dom.createElement(field.getDirectiveName(attrs), attrs);
                    formInput.attr('model', 'data.'+attrs.name);
                    formInput.attr('form', 'formCtrl.'+attrs.name);
                    formGroup.append(formInput);

                    elm.append(formGroup);
                }
            }
        })
        .directive('grMessages', function () {
            return {
                restrict: 'E',
                scope: {
                    messages: '=',
                    form: '='
                },
                template: '<span class="help-block" ng-repeat="(key, value) in form.$error" ng-show="form.$dirty && form.$error[key]">' +
                    '{{messages[key]}}' +
                '</span>'
            }
        })
        .directive('grInputDate', InputDirectiveFactory('date'))
        .directive('grInputTime', InputDirectiveFactory('time'))
        .directive('grInputDatetime', InputDirectiveFactory('datetime'))
        .directive('grInputMoney', InputDirectiveFactory('float', {decimal:2}))
        .directive('grInputBigString', InputDirectiveFactory('textarea'))
        .directive('grInputString', InputDirectiveFactory('text'));

})(angular);