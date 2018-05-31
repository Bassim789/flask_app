'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
	function Router(domain) {
		_classCallCheck(this, Router);

		this.domain = domain;
	}

	_createClass(Router, [{
		key: 'get_url_param',
		value: function get_url_param(param) {
			var page_url = decodeURIComponent(window.location.search.substring(1)),
			    url_vars = page_url.split('&');
			for (var i = 0; i < url_vars.length; i++) {
				var param_name = url_vars[i].split('=');
				if (param_name[0] === param) {
					return param_name[1] === undefined ? false : param_name[1];
				}
			}
			return false;
		}
	}, {
		key: 'change_page',
		value: function change_page(page) {
			window.history.pushState('', '', this.domain + page);
			this.load_page();
			$(window).scrollTop();
		}
	}, {
		key: 'convert_arg_to_path',
		value: function convert_arg_to_path() {
			var new_url = window.location.href.replace('?page=', '').replace('&', '?');
			window.history.replaceState('', '', new_url);
		}
	}, {
		key: 'load_page',
		value: function load_page() {
			if (this.get_url_param('page')) this.convert_arg_to_path();
			var page_name = location.pathname.split(this.domain)[1].replace(/\//g, '');
			page_name = page_name === '' ? 'index' : page_name;
			new pages[page_name]();
		}
	}]);

	return Router;
}();
