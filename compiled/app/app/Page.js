'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = function () {
	function Page() {
		_classCallCheck(this, Page);
	}

	_createClass(Page, null, [{
		key: 'add',
		value: function add(page) {
			page.render = function () {
				console.log(this.data);
				this.render_page(this.data);
			};
			page.render_page = function (data) {
				$('#body').template_page(this.page_name, data);
			};
			page.redirect_to_homepage_if_not_logged = function () {
				if (!gvar.user.is_logged) {
					app.change_page('');
					return true;
				}
				return false;
			};
			pages[page.page_name] = function () {
				if (page.data === undefined) page.data = {};
				if (page.only_user_logged === undefined) page.only_user_logged = false;
				if (page.page_from_backend === undefined) page.page_from_backend = true;
				if (page.data_from_backend === undefined) page.data_from_backend = false;
				if (page.only_user_logged) {
					if (page.redirect_to_homepage_if_not_logged()) {
						return false;
					}
				}
				if (page.data_from_backend) {
					$.each(gvar.page_data, function (page_data_key) {
						page.data[page_data_key] = gvar.page_data[page_data_key];
					});
				}
				if (!page.page_from_backend) {
					page.render();
				} else if (!gvar.first_load) {
					page.render();
				}
				var events = {};
				$.each(page, function (key_page_elem, page_elem) {
					if (key_page_elem === 'events') {
						$.each(page_elem, function (key_event_type, event_type) {
							$.each(event_type, function (key_event, event) {
								if (typeof event === 'function') {
									if (events[key_event_type] === undefined) {
										events[key_event_type] = [];
									}
									events[key_event_type].push(key_event);
									page[key_event] = event;
								}
							});
						});
					}
				});
				if ($.isEmptyObject(events) && page.events !== undefined) {
					events = page.events;
				}
				console.log(events);
				new Event_binder(page, '#body', events);
				if (page.init !== undefined) page.init();
				gvar.first_load = false;
			};
		}
	}]);

	return Page;
}();
