'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event_binder = function () {
	function Event_binder(source, container, events) {
		_classCallCheck(this, Event_binder);

		this.source = source;
		this.container = $(container);
		this.each_event(events);
	}

	_createClass(Event_binder, [{
		key: 'each_event',
		value: function each_event(events) {
			var _this = this;

			$.each(events, function (event, actions) {
				$.each(actions, function (i, action) {
					_this.bind(event, action);
				});
			});
		}
	}, {
		key: 'bind',
		value: function bind(event, action) {
			var source = this.source,
			    id = '[event~="' + event + ':' + action + '"]';
			if (event === 'enter') {
				this.container.off('keyup', id).on('keyup', id, function (e) {
					if (e.which === 13) {
						return source[action](this, e);
					}
				});
			} else {
				this.container.off(event, id).on(event, id, function (e) {
					return source[action](this, e);
				});
			}
		}
	}]);

	return Event_binder;
}();
