'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function () {
	function Watcher() {
		_classCallCheck(this, Watcher);

		this.url = '//:3013';
		if (gvar.watcher) this.connect();
	}

	_createClass(Watcher, [{
		key: 'connect',
		value: function connect() {
			this.socket = io.connect(this.url, { reconnection: false });
			this.event();
		}
	}, {
		key: 'event',
		value: function event() {
			var _this = this;

			this.socket.on('file_updated', function (data) {
				_this.reload(data.file_name);
			});
		}
	}, {
		key: 'reload_css',
		value: function reload_css(file) {
			var name = file.split('www/')[1].split('.css')[0];
			var queryString = '?reload=' + new Date().getTime();
			$('link[rel="stylesheet"]').each(function () {
				if (this.href.includes(name)) {
					this.href = this.href.replace(/\?.*|$/, queryString);
				}
			});
		}
	}, {
		key: 'reload',
		value: function reload(file) {
			if (file.endsWith('.css')) {
				this.reload_css(file);
			} else {
				location.reload();
			}
		}
	}]);

	return Watcher;
}();
