angular.module('gear-notice', [])
    .directive('noticeBar', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="gr-notice {{note.type}}">{{note.message}}</div>',
            scope: {
                note: '='
            }
        }
    })
    .factory('grNotify', function ($animate, $compile, $rootScope) {
        var grNotices = angular.element('.gr-notices');
        if (!grNotices.length) {
            grNotices = angular.element('<div class="gr-notices">');
            angular.element('body').append(grNotices);
        }

        function Note (message, type) {
            this.type = type || 'warning';
            this.message = message;
            this.element = angular.element('<notice-bar note="note">');

            var noticeScope = $rootScope.$new();
            noticeScope.note = this;
            $compile(this.element)(noticeScope);
console.log(this.element);
            $animate.enter(this.element, grNotices);
        }
        Note.prototype.success = function (message) {
            this.type = 'success';
            this.message = message;
        };
        Note.prototype.error = function (message) {
            this.type = 'error';
            this.message = message;
        };
        Note.prototype.warn = function (message) {
            this.type = 'warning';
            this.message = message;
        };
        Note.prototype.remove = function () {
            $animate.leave(this.element);
        };

        return function notify (message, type) {
            return new Note(message, type);
        };
    });