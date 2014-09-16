angular.module('gear-notice', ['ngAnimate'])
    .directive('noticeBar', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div><div class="gr-notice {{note.type}}">{{note.message}}</div></div>',
            scope: {
                note: '='
            }
        }
    })
    .factory('grNote', function ($animate, $compile, $rootScope) {
        var grNotices = angular.element('.gr-notices');
        if (!grNotices.length) {
            grNotices = angular.element('<div class="gr-notices">');
            angular.element('body').append(grNotices);
        }

        function Note () {
            this.element = angular.element('<notice-bar note="note">');
            this.pasted = false;
        }
        Note.prototype.success = function (message) {
            this.write(message || 'Done!', 'success');
        };
        Note.prototype.error = function (message) {
            this.write(message || 'Error!', 'error');
        };
        Note.prototype.loading = function (message) {
            this.write(message || 'Working...', 'warning');
        };
        Note.prototype.warn = function (message) {
            this.write(message, 'warning');
        };
        Note.prototype.write = function (message, type) {
            this.type = type;
            this.message = message;

            if (!this.pasted) {
                var noticeScope = $rootScope.$new();
                noticeScope.note = this;
                $compile(this.element)(noticeScope);

                $animate.enter(this.element, grNotices);
                this.pasted = true;
            }
        };
        Note.prototype.remove = function () {
            $animate.leave(this.element);
            this.pasted = false;
        };

        return Note;
    });