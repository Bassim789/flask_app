'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

pages.page_2 = function () {
	function _class() {
		_classCallCheck(this, _class);

		$('#body').template('page_2');
		new Event_binder(this, '#body', {
			click: ['go_to_page_1', 'click_on_input'],
			enter: ['press_enter'],
			keyup: ['which_key']
		});
	}

	_createClass(_class, [{
		key: 'go_to_page_1',
		value: function go_to_page_1() {
			app.router.change_page('');
		}
	}, {
		key: 'click_on_input',
		value: function click_on_input() {
			console.log('click_on_input');
		}
	}, {
		key: 'press_enter',
		value: function press_enter() {
			console.log('press_enter');
		}
	}, {
		key: 'which_key',
		value: function which_key(el, event) {
			console.log('key: ' + event.which);
		}
	}]);

	return _class;
}();
