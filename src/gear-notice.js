angular.module('gear-notice')
    .directive('noticeBar', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="gr-notice-bar {{note.type}}">{{note.message}}</div>',
            scope: {
                note: '='
            }
        }
    })
    .factory('notify', function (_, $compile, $rootScope) {
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

            grNotices.append(this.element);
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
            this.element.remove();
        };

        return function notify (message, type) {
            return new Note(message, type);
        };
    });