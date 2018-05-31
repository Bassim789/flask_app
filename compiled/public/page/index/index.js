'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

pages.index = function () {
	function _class() {
		_classCallCheck(this, _class);

		$('#body').template('page_index', {
			name: 'your name'
		});
		new Event_binder(this, '#body', {
			click: ['header_clicked', 'go_to_page_2', 'test_api']
		});
	}

	_createClass(_class, [{
		key: 'header_clicked',
		value: function header_clicked() {
			alert('header_clicked from page 1');
		}
	}, {
		key: 'go_to_page_2',
		value: function go_to_page_2() {
			app.router.change_page('page_2');
		}
	}, {
		key: 'test_api',
		value: function test_api() {
			$.api_php('test_data', '', {}, function (data) {
				console.log(data);
			});
		}
	}]);

	return _class;
}();
