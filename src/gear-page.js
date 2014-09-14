angular.module('gear.page', [])
    .factory('grPage', function () {
        var page = {
            title: '',
            desc: ''
        };
        return page;
    })
    .directive('grPageHeader', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                title: '@',
                desc: '@'
            },
            template: '<div class="page-header">' +
                '<div class="page-title">' +
                    '<h3>{{title}}</h3><span>{{desc}}</span>' +
                '</div>' +
            '</div>'
        }
    })