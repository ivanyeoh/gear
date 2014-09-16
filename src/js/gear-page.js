angular.module('gear.page', [])
    .run(function ($rootScope) {
        $rootScope.grPage = {};
        $rootScope.$on('$routeChangeStart', function (e, current) {
            if (!current.$$route) return;
            var routePage = current.$$route.page;
            $rootScope.grPage.title = routePage.title;
            $rootScope.grPage.desc = routePage.desc;
        });
    })
    .directive('grPageHeader', function (gr, $rootScope) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                title: '@',
                desc: '@'
            },
            transclude: true,
            template: '<div class="page-header">' +
                '<div class="page-title">' +
                    '<h3>{{title}}</h3><span>{{desc}}</span>' +
                '</div>' +
            '</div>',
            link: function (scope, element, attrs, ctrl, transclude) {
                $rootScope.$watch('grPage', function () {
                    scope.title = $rootScope.grPage.title;
                    scope.desc = $rootScope.grPage.desc;
                }, true);

                transclude(scope, function (tElements) {
                    element.append(tElements);
                });
            }
        }
    })
    .directive('grPageStats', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<ul class="page-stats" ng-transclude></ul>'
        }
    })
    .directive('grPageStat', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                title: '@',
                desc: '@'
            },
            template: '<li><div class="summary"><span>{{title}}</span><h3>{{desc}}</h3></div></li>'
        }
    })