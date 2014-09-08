angular.module('gear.form', ['gear.helper','gear.validator','ngMessages'])
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
    .directive('grForm', function (gr, arr, $compile, str, $injector) {
        return {
            restrict: 'E',
            replace: true,
            template: '<ng-form name="form" class="form-horizontal"></ng-form>',
            link: function (scope, element) {

                if (scope.dataDefinitions) {
                    arr.forEach(scope.dataDefinitions, function (definition) {
                        var inputDirectiveName = 'gr-input-'+definition.type;
                        gr.ensureDirectiveExists(inputDirectiveName);

                        var validationJson = angular.toJson(definition.validations);
                        var inputDirective = angular.element('<'+inputDirectiveName+'>');
                        inputDirective.attr('id', definition.field);
                        inputDirective.attr('name', definition.field);
                        inputDirective.attr('field-type', definition.type);
                        inputDirective.attr('validations', validationJson);
                        inputDirective.attr('model', 'data.'+definition.field);

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
    .directive('grFormActions', function () {
        return {
            restrict: 'E',
            replace: true
        }
    })
    .directive('grFormGroup', function (str, arr) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                name: '@',
                label: '@',
                form: '=',
                validations: '='
            },
            template: '<div class="form-group" ng-class="{\'has-error\': form[name].$dirty && form[name].$invalid}">' +
                '<label class="control-label col-sm-2">{{label||name}}</label>' +
                '<div class="control-input col-sm-10">' +
                    '<span ng-transclude></span>' +
                    '<span ng-messages="form[name].$dirty && form[name].$error"></span>' +
                '</div>' +
            '</div>',
            compile: function (element, attrs) {
                var messages = angular.element(element.find('span')[1]);
                var validations = angular.fromJson(attrs.validations);
                arr.forEach(validations, function (validation) {
                    var helpBlock = angular.element('<span>');
                    helpBlock.attr('class', 'help-block');
                    helpBlock.attr('ng-message', validation.type);
                    helpBlock.html(validation.message);

                    messages.append(helpBlock);
                });
            }
        }
    })
    .directive('grInputMoney', function (gr) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                validations: '='
            },
            template: '<input type="text" class="form-control" ng-model="model" ng-model-options="{updateOn:\'blur\'}"/>',
            link: function (scope, element) {
                scope.$watch('model', function () {
                    if (!scope.model) return;

                    scope.model = Math.floor(parseFloat(scope.model) * 100) / 100;
                });
                gr.appendInputValidations(scope, element);
            }
        }
    })
    .directive('grInputDatetime', function (gr) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                validations: '='
            },
            template: '<div class="row">' +
                '<div class="col-sm-7"><gr-input-date model="date"></gr-input-date></div>' +
                '<div class="col-sm-5"><gr-input-time model="time"></gr-input-time></div>' +
                '<input type="hidden" ng-model="model" />' +
            '</div>',
            link: function (scope, element, attrs) {
                gr.appendInputValidations(scope, element.find('input[type=hidden]'));

                scope.$watch('date', function () {
                    if (scope.time) {
                        scope.model = scope.date+' '+scope.time;
                    }
                });
                scope.$watch('time', function () {
                    if (scope.date) {
                        scope.model = scope.date+' '+scope.time;
                    }
                });
            }
        };
    })
    .directive('grInputDate', function (gr) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                validations: '='
            },
            template: '<div class="input-group">' +
                '<input type="text" class="form-control" placeholder="Select a date" />' +
                '<input type="hidden" ng-model="model" ng-model-options="{updateOn:\'blur\'}" />' +
                '<span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>' +
            '</div>',
            link: function (scope, element) {
                var dateInput = element.find('input[type=text]');

                gr.appendInputValidations(scope, element.find('input[type=hidden]'));

                function onSet (e) {
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
        }
    })
    .directive('grInputTime', function (gr) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                validations: '='
            },
            template: '<div class="input-group">' +
                '<input type="text" class="form-control" placeholder="Select a time" />' +
                '<input type="hidden" ng-model="model" ng-model-options="{updateOn:\'blur\'}" />' +
                '<span class="input-group-addon"><i class="fa fa-clock-o"></i></span>' +
            '</div>',
            link: function (scope, element) {
                var timeInput = element.find('input[type=text]');

                gr.appendInputValidations(scope, element.find('input[type=hidden]'));

                function onSet (e) {
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
        }
    });