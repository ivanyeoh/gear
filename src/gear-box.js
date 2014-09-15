angular.module('gear.box', [])
    .directive('grWidgetBox', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                header: '@'
            },
            template: '<div class="widget box">' +
                '<div class="widget-header"><h4><i class="fa fa-reorder"></i> {{ header }}</h4></div>' +
                '<div class="widget-content" ng-transclude></div>' +
                '</div>'
        }
    });