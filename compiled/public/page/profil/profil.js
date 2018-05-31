'use strict';

Page.add({
	page_name: 'profil',
	page_from_backend: true,
	data_from_backend: false,
	only_user_logged: true,
	events: {
		click: {
			delete_data_click: function delete_data_click(elem) {
				var _this = this;

				var box = $(elem).parent();
				var id_data = box.data('id_data');
				var msg = "Veux-tu vraiment supprimer cette donnée?<br>";
				app.confirm(msg, function () {
					box.hide();
					$.api_php('public/variable', 'delete_data', {
						id_data: id_data
					}, function (data) {
						console.log(data);
						_this.load_total_data();
					});
				});
			}
		},
		change: {
			input_date_change: function input_date_change() {
				this.load_total_data();
			}
		}
	},
	init: function init() {
		this.add_data_info = new parts.add_data_info(this);
		this.search_variable = new parts.search_variable(this);
		$('#data_total_box').template('data_total', {
			current_date: moment().format('YYYY-MM-DD')
		});
		this.load_total_data();
	},
	load_total_data: function load_total_data() {
		var _this2 = this;

		this.get_data_total(function (data) {
			var data_entries = data.data;
			$.each(data_entries, function (i, data_entry) {
				var moment_start = moment.unix(data_entry.time_start);
				var moment_end = moment.unix(data_entry.time_end);
				data_entries[i].start = moment_start.format('YYYY-MM-DD HH:mm:ss');
				data_entries[i].end = moment_end.format('YYYY-MM-DD HH:mm:ss');
				var duration = moment.duration(moment_end.diff(moment_start));
				var duration_str = duration.format("HH:mm:ss");
				if (duration_str === '00') duration_str = '00:00:00';
				if (duration_str.length < 7) duration_str = '00:' + duration_str;
				if (duration_str.length < 7) duration_str = '00:' + duration_str;
				data_entries[i].duration = duration_str;
				data_entries[i].duration_clean = _this2.readable_duration(duration._milliseconds);
			});
			$('#data_total_data_box').template('data_total_data', {
				data: data_entries
			});
			_this2.init_datetimepicker();
			$('#data_total_start_date').datepicker();
			$('#data_total_end_date').datepicker();
		});
	},
	readable_duration: function readable_duration(duration_ms) {
		return humanizeDuration(duration_ms, {
			language: 'fr',
			round: true,
			spacer: ' ',
			units: ['h', 'm', 's']
		});
	},
	get_data_total: function get_data_total(callback) {
		var start_date = moment($('#data_total_start_date').val(), 'YYYY-MM-DD');
		var start_date_unix = start_date.unix();
		var end_date_unix = void 0;
		if ($('#data_total_end_date').val() === '') {
			end_date_unix = start_date.add(1, 'day').unix();
		} else {
			var end_date = moment($('#data_total_end_date').val(), 'YYYY-MM-DD');
			end_date_unix = end_date.add(1, 'day').unix();
		}
		$.api_php('public/variable', 'get_data_total', {
			start_date_unix: start_date_unix,
			end_date_unix: end_date_unix
		}, function (data) {
			if (callback) callback(data);
		});
	},
	get_range_from_box_id: function get_range_from_box_id(id) {
		var start_date = moment($('#data_total_start_date').val(), 'YYYY-MM-DD');
		var start_date_unix = start_date.unix();
		var end_date_unix = false;
		if ($('#data_total_end_date').val() === '') {
			end_date_unix = start_date.add(1, 'day').unix();
		} else {
			var end_date = moment($('#data_total_end_date').val(), 'YYYY-MM-DD');
			end_date_unix = end_date.add(1, 'day').unix();
		}
	},
	get_unix_from_input_id: function get_unix_from_input_id() {},
	init_datetimepicker: function init_datetimepicker() {
		$("#dtBox").DateTimePicker({
			dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
			timeFormat: "HH:mm:ss",
			shortDayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
			shortMonthNames: ["Jan", "Fev", "Mar", "Apv", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"],
			fullMonthNames: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"],
			showHeader: true,
			titleContentDateTime: "",
			titleContentTime: "",
			buttonsToDisplay: ["SetButton"],
			setButtonContent: "OK",
			setValueInTextboxOnEveryClick: true,
			incrementButtonContent: "&#9650;",
			decrementButtonContent: "&#9660;",
			labels: {
				"year": "Année",
				"month": "Mois",
				"day": "Jour",
				"hour": "Heu.",
				"minutes": "Min.",
				"seconds": "Sec."
			}
		});
	}
});
