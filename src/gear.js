angular.module('gear', ['gear.form'])
    .factory('gr', function (arr, str, $injector, $compile) {
        return {
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
    });