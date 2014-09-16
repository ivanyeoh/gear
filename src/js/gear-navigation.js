angular.module('gear.navigation', [])
    .directive('grNavbar', function (gr) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                fluid: '=?'
            },
            template: '<header class="navbar navbar-default" role="navigation">' +
                '<div ng-class="{\'container\':!fluid, \'container-fluid\':fluid}" ng-transclude></div>' +
            '</header>',
            link: function (scope) {
                gr.setDefaultValue(scope, 'fluid', true);
            }
        }
    })
    .directive('grNavbarHeader', function (gr) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                href: '@'
            },
            template: '<div class="navbar-header"><a class="navbar-brand" href="{{href}}" ng-transclude></a></div>',
            link: function (scope) {
                gr.setDefaultValue(scope, 'href', true);
            }
        }
    })
    .directive('grNavbarNav', function (dom) {
        function getComponentName (element) {
            return element.dataset ? element.dataset.component : '';
        }

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                position: '@'
            },
            template: '<ul class="nav navbar-nav" ng-class="{\'navbar-right\':position==\'right\'}"></ul>',
            link: function (scope, element, attrs, ctrl, transclude) {
                transclude(scope, function (tElements) {
                    angular.forEach(tElements, function (tElement) {
                        if (!dom.hasContent(tElement)) return false;

                        element.append(tElement);
                    });
                });
            }
        }
    })
    .directive('grNavbarLink', function (dom) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                href: '@'
            },
            template: '<li><a href="{{href}}" ng-transclude></a></li>'
        }
    });