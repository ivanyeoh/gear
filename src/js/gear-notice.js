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
    .directive('alertBox', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="alert alert-{{className}} fade in">' +
                    '<i class="fa fa-remove close" ng-click="close()"></i>' +
                    '<strong>{{note.type|capitalize}}!</strong> {{note.message}}' +
                '</div>',
            scope: {
                note: '='
            },
            link: function (scope) {
                scope.className = scope.note.type == 'error' ? 'danger' : scope.note.type;
                scope.close = function () {
                    scope.note.erase();
                }
            }
        }
    })
    .factory('grNote', function ($animate, $compile, $rootScope, str, gr) {
        var grNotices = angular.element('.gr-notices');
        if (!grNotices.length) {
            grNotices = angular.element('<div class="gr-notices">');
            angular.element('body').append(grNotices);
        }

        function Note (type, parent) {
            this.elementType = type ? str.dasherize(type) : '';
            this.elementType = gr.hasDirective(this.elementType) ? this.elementType : 'notice-bar';
            this.pasted = false;
            this.parent = parent || grNotices;
            this.scope = $rootScope.$new();
            this.scope.note = this;
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
                if (this.element) this.element.remove();
                this.element = angular.element('<'+str.dasherize(this.elementType)+' note="note">');

                $compile(this.element)(this.scope);

                $animate.enter(this.element, this.parent);
                this.pasted = true;
            }
        };
        Note.prototype.erase = function () {
            $animate.leave(this.element);
            this.pasted = false;
        };

        return Note;
    });