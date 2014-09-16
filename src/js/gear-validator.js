angular.module('gear.validator', [])
    .directive('validateRequired', function (gr, str, $parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) return;

                var validation = angular.fromJson(attrs.validateRequired);

                attrs.$observe('validateRequired', function(value) {
                    ctrl.$validate();
                });
                ctrl.$validators[validation.type] = function(modelValue, viewValue) {
                    return !str.isBlank(viewValue);
                };
            }
        };
    })
    .directive('validateMin', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) return;

                function registerValidator () {
                    var validation = angular.fromJson(attrs.validateMin);
                    if (attrs.fieldType.match(/string/)) {
                        ctrl.$validators[validation.type] = function(modelValue, viewValue) {
                            return viewValue.length >= validation.value;
                        };
                    }
                    else {
                        ctrl.$validators[validation.type] = function(modelValue, viewValue) {
                            return viewValue >= validation.value;
                        };
                    }
                }

                attrs.$observe('validateMin', function(value) {
                    registerValidator();
                    ctrl.$validate();
                });

                registerValidator();
            }
        }
    })
    .directive('validateMax', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) return;

                function registerValidator () {
                    var validation = angular.fromJson(attrs.validateMax);
                    if (attrs.fieldType.match(/string/)) {
                        ctrl.$validators[validation.type] = function(modelValue, viewValue) {
                            return viewValue.length <= validation.value;
                        };
                    }
                    else {
                        ctrl.$validators[validation.type] = function(modelValue, viewValue) {
                            return viewValue <= validation.value;
                        };
                    }
                }

                attrs.$observe('validateMax', function(value) {
                    registerValidator();
                    ctrl.$validate();
                });

                registerValidator();
            }
        }
    });