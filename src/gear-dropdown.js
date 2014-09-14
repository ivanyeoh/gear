angular.module('gear.dropdown', [])
.directive('grDropdown', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            header: '@',
            tagName: '@'
        },
        template: '<li data-component="dropdown">' +
            '<a href="#" class="dropdown-toggle" data-toggle="dropdown">{{header}} <span class="caret"></span></a>' +
            '<ul class="dropdown-menu" role="menu" ng-transclude></ul>' +
        '</li>'
    }
})
.directive('grDropdownItem', function () {
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