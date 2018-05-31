'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

parts.add_data_info = function () {
	function _class(page) {
		_classCallCheck(this, _class);

		this.page = page;
		$('#add_data_info_box').template('add_data_info');
		new Event_binder(this, '#add_data_info_box', {
			click: ['add_data_save_click', 'delete_variable_click'],
			change: ['input_time_change']
		});
	}

	_createClass(_class, [{
		key: 'delete_variable_click',
		value: function delete_variable_click() {
			var _this = this;

			var var_name = $('#input_add_data').val().trim();
			var msg = "Veux-tu vraiment supprimer cette variable?<br>";
			msg += "<strong>" + var_name + "</strong>";
			app.confirm(msg, function () {
				$('#input_add_data').val('').keyup();
				$.api_php('public/variable', 'delete_variable', {
					name: var_name
				}, function (data) {
					_this.page.search_variable.get_variables();
					$('#input_add_data').keyup();
					_this.page.load_total_data();
				});
			});
		}
	}, {
		key: 'add_data_save_click',
		value: function add_data_save_click() {
			var _this2 = this;

			console.log('add_data_save_click()');
			var var_name = $('#input_add_data').val().trim();
			var time_start = $('#input_start_time').val();
			var time_last = $('#input_time_last').val();
			var time_end = $('#input_end_time').val();
			$.api_php('public/variable', 'add_data', {
				var_name: var_name,
				time_start: time_start,
				time_last: time_last,
				time_end: time_end
			}, function (data) {
				console.log(data);
				_this2.page.search_variable.reset();
				_this2.page.load_total_data();
			});
		}
	}, {
		key: 'input_time_change',
		value: function input_time_change(elem) {
			var elem_id = $(elem).attr('id');
			if (elem_id === 'input_start_time') {
				this.set_time_last();
			} else if (elem_id === 'input_time_last') {
				this.set_time_end();
				this.update_clean_duration();
			} else if (elem_id === 'input_end_time') {
				this.set_time_last();
			}
		}
	}, {
		key: 'set_time_last',
		value: function set_time_last() {
			var moment_start = moment($('#input_start_time').val());
			var moment_end = moment($('#input_end_time').val());
			var duration = moment.duration(moment_end.diff(moment_start));
			var duration_str = duration.format("HH:mm:ss");
			if (duration_str === '00') duration_str = '00:00:00';
			$('#input_time_last').val(duration_str);
			this.update_clean_duration();
		}
	}, {
		key: 'set_time_end',
		value: function set_time_end() {
			var moment_start = moment($('#input_start_time').val());
			var duration_str = $('#input_time_last').val();
			var duration_in_seconde = this.time_last_to_second(duration_str);
			var moment_end = moment_start.add(duration_in_seconde, 's');
			var moment_end_str = moment_end.format("YYYY-MM-DD HH:mm:ss");
			$('#input_end_time').val(moment_end_str);
		}
	}, {
		key: 'time_last_to_second',
		value: function time_last_to_second(time_str) {
			var time_parts = time_str.split(':');
			return parseInt(time_parts[0]) * 3600 + parseInt(time_parts[1]) * 60 + parseInt(time_parts[2]);
		}
	}, {
		key: 'show',
		value: function show() {
			$('#add_data_info').show();
			this.init_datetimepicker();
			var actual_date_str = moment().format("YYYY-MM-DD HH:mm:ss");
			$('#input_start_time').val(actual_date_str);
			$('#input_end_time').val(actual_date_str);
			$('#input_time_last').val('00:00:00');
			this.update_clean_duration();
		}
	}, {
		key: 'update_clean_duration',
		value: function update_clean_duration() {
			var elem = $('#input_time_last');
			var duration_str = elem.val();
			var duration_ms = moment.duration(duration_str, 'HH:mm:ss')._milliseconds;
			var duration_clean = this.page.readable_duration(duration_ms);
			var duration_clean_div = elem.parent().find('.duration_clean');
			duration_clean_div.html(duration_clean);
		}
	}, {
		key: 'hide',
		value: function hide() {
			$('#add_data_info').hide();
		}
	}, {
		key: 'init_datetimepicker',
		value: function init_datetimepicker() {
			this.page.init_datetimepicker();
		}
	}]);

	return _class;
}();
