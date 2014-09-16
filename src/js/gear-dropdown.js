angular.module('gear.dropdown', [])
.directive('grDropdown', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            header: '@',
            headerClass: '@',
            icon: '@',
            tagName: '@'
        },
        template: '<li class="dropdown">' +
            '<a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">' +
                '<i class="fa fa-male" ng-if="icon"></i>' +
                '<span class="{{headerClass}}">{{header}}</span> ' +
                '<i class="caret small"></i>' +
            '</a>' +
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