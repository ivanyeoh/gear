angular.module('gear.box', [])
    .directive('grWidget', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                header: '@',
                boxed: '@'
            },
            template: '<div class="widget" ng-class="{box:boxed}">' +
                '<div class="widget-header"><h4><i class="fa fa-reorder"></i> {{ header }}</h4></div>' +
                '<div class="widget-content" ng-transclude></div>' +
                '</div>'
        }
    });