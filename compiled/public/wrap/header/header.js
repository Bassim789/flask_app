'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Header = function () {
	function Header() {
		_classCallCheck(this, Header);

		this.sidr_width = 260;
		this.sidr_transition = 200;
		this.elem_to_move = ['header', '#background', '#body_wrap'];
		this.event();
		this.load();
	}

	_createClass(Header, [{
		key: 'event',
		value: function event() {
			new Event_binder(this, 'header', {
				click: ['logout', 'toggle_sidr', 'logout_lia', 'goto']
			});
		}
	}, {
		key: 'goto',
		value: function goto(elem) {
			app.change_page($(elem).attr('page'));
			this.close_sidr();
		}
	}, {
		key: 'logout',
		value: function logout() {
			var _this = this;

			this.close_sidr();
			$.api_php('public/login', 'logout', {}, function (data) {
				gvar.user.is_logged = false;
				gvar.user.is_admin = false;
				gvar.user.session_hash = false;
				app.change_page('');
				_this.load();
			});
		}
	}, {
		key: 'load',
		value: function load() {
			$('header').template('header', {
				user_is_logged: gvar.user.is_logged,
				logo: gvar.img.logo,
				email: gvar.user.email
			});
			this.load_backround_sidr();
		}
	}, {
		key: 'load_backround_sidr',
		value: function load_backround_sidr() {
			$('#sidr_background').css({ backgroundImage: 'url(' + gvar.img.default_sidr + ')' });
		}
	}, {
		key: 'toggle_sidr',
		value: function toggle_sidr() {
			var is_closed = $('#overlay_sidebar_menu').css('display') == 'none';
			is_closed ? this.open_sidr() : this.close_sidr();
		}
	}, {
		key: 'open_sidr',
		value: function open_sidr() {
			var _this2 = this;

			var full_height = Math.max($(document).height(), $(window).height());
			$('#overlay_sidebar_menu').show().css({
				height: full_height + 'px',
				opacity: 0.0
			}).animate({ opacity: 0.7 }, this.sidr_transition);
			$.each(this.elem_to_move, function (i, elem) {
				$(elem).animate({ right: _this2.sidr_width + "px" }, _this2.sidr_transition);
			});
			$('.menu_btn').animate({ opacity: 0.0 }, this.sidr_transition);
		}
	}, {
		key: 'close_sidr',
		value: function close_sidr() {
			var _this3 = this;

			$('#overlay_sidebar_menu').css({ opacity: 0.7 }).animate({ opacity: 0.0 }, {
				duration: this.sidr_transition,
				complete: function complete() {
					$('#overlay_sidebar_menu').hide();
				}
			});
			$.each(this.elem_to_move, function (i, elem) {
				$(elem).animate({ right: "0px" }, _this3.sidr_transition);
			});
			$('.menu_btn').animate({ opacity: 1.0 }, this.sidr_transition);
		}
	}]);

	return Header;
}();
