'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App() {
		_classCallCheck(this, App);

		this.header = new Header();
		this.body = new Body();
		this.watcher = new Watcher();
		this.router = new Router('/');
		$('body').on('submit', 'form', function () {
			return false;
		});
	}

	_createClass(App, [{
		key: 'change_page',
		value: function change_page(page) {
			this.router.change_page(page);
		}
	}, {
		key: 'confirm',
		value: function confirm(msg, callback) {
			$.confirm(msg, function (valided) {
				if (valided) callback();
			});
		}
	}]);

	return App;
}();
