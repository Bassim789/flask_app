'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

pages.timeline = function () {
	function _class() {
		_classCallCheck(this, _class);

		$('#body').template('page_timeline', {
			start_date: moment().add(-7, 'day').format('YYYY-MM-DD'),
			end_date: moment().add(7, 'day').format('YYYY-MM-DD')
		});
		this.init_select_range();
		this.load_timeline_data();
	}

	_createClass(_class, [{
		key: 'init_select_range',
		value: function init_select_range() {
			$('#timeline_start_date').datepicker();
			$('#timeline_end_date').datepicker();
			new Event_binder(this, '#timeline_select_range_box', {
				change: ['input_date_change']
			});
		}
	}, {
		key: 'input_date_change',
		value: function input_date_change() {
			this.load_timeline_data();
		}
	}, {
		key: 'unix_to_date_object',
		value: function unix_to_date_object(unix) {
			return new Date(unix * 1000);
		}
	}, {
		key: 'tooltip',
		value: function tooltip(tooltip_info) {
			return $.get_template('timeline_tooltip', {
				var_name: tooltip_info.var_name
			});
		}
	}, {
		key: 'load_timeline_data',
		value: function load_timeline_data() {
			var _this = this;

			var start_date = moment($('#timeline_start_date').val(), 'YYYY-MM-DD');
			var start_date_unix = start_date.unix();
			var end_date_unix = void 0;
			if ($('#timeline_end_date').val() === '') {
				end_date_unix = start_date.add(14, 'day').unix();
			} else {
				var end_date = moment($('#timeline_end_date').val(), 'YYYY-MM-DD');
				end_date_unix = end_date.add(1, 'day').unix();
			}
			$.api_php('public/variable', 'get_data_timeline', {
				start_date_unix: start_date_unix,
				end_date_unix: end_date_unix
			}, function (data) {
				var timeline_data = [];
				$.each(data.entries, function (i, entry) {
					var var_name = entry.var_name,
					    start_date = _this.unix_to_date_object(entry.time_start),
					    end_date = _this.unix_to_date_object(entry.time_end),
					    tooltip_info = { var_name: var_name };
					timeline_data.push({
						var_name: var_name,
						tooltip: _this.tooltip(tooltip_info),
						start_date: start_date,
						end_date: end_date,
						var_id: entry.id_variable
					});
				});
				if (timeline_data.length > 0) {
					_this.init_timeline(timeline_data);
				} else {
					$('#timeline_box').html('Aucune données pour ces dates');
				}
			});
		}
	}, {
		key: 'append_style',
		value: function append_style(style) {
			var css = style,
			    head = document.head || document.getElementsByTagName('head')[0],
			    style = document.createElement('style');
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			head.appendChild(style);
		}
	}, {
		key: 'get_readable_duration',
		value: function get_readable_duration(duration_ms) {
			return humanizeDuration(duration_ms, {
				language: 'fr',
				round: true,
				spacer: ' ',
				units: ['h', 'm', 's']
			});
		}
	}, {
		key: 'init_timeline',
		value: function init_timeline(timeline_data) {
			var _this2 = this,
			    _options;

			var min_date = new Date(2222, 0, 1);
			var max_date = new Date(1776, 4, 1);
			var groups_data = [];
			var groups_names = [];
			var items_data = [];
			var style = '';
			var color_num = 0;
			var colors = ['#FA8072', '#B0E2FF', '#beb0ff', '#faa172', '#71bbe6', '#b0ffcd'];
			var color_item = false;
			timeline_data.forEach(function (item, i) {
				if (item.start_date < min_date) {
					min_date = item.start_date;
				}
				if (item.end_date > max_date) {
					max_date = item.end_date;
				}
				if (color_num >= colors.length) color_num = 0;
				if (!groups_names.includes(item.var_name)) {
					groups_data.push({
						content: item.var_name,
						id: item.var_name,
						value: groups_data.length + 1,
						className: 'timeline_group_' + color_num,
						color_num: color_num
					});
					groups_names.push(item.var_name);
					style += '\n.vis-item.timeline_group_' + color_num;
					style += '{background: ' + colors[color_num] + ';}';
					color_num += 1;
				}
				groups_data.forEach(function (group) {
					if (item.var_name === group.id) {
						color_item = group.color_num;
					}
				});
				var start_unix = item.start_date.getTime();
				var end_unix = item.end_date.getTime();
				var readable_duration = _this2.get_readable_duration(end_unix - start_unix);
				items_data.push({
					start: item.start_date,
					end: item.end_date,
					group: item.var_name,
					className: 'timeline_group_' + color_item,
					content: item.var_name,
					id: item.var_name + '_' + (i + 1),
					title: item.var_name + '<br>' + readable_duration,
					type: start_unix === end_unix ? 'box' : 'range'
				});
			});

			this.append_style(style);

			var groups = new vis.DataSet(groups_data);
			var items = new vis.DataSet(items_data);

			var container = document.getElementById('timeline_box');
			$(container).html('');
			var options = (_options = {
				groupOrder: function groupOrder(a, b) {
					return a.value - b.value;
				},
				groupOrderSwap: function groupOrderSwap(a, b, groups) {
					var v = a.value;
					a.value = b.value;
					b.value = v;
				},
				onMove: function onMove(data) {
					console.log('update');
					console.log(data);
				},
				template: function template(item, element, data) {
					return '<div>' + item.content + '</div>';
				},
				orientation: 'both',
				editable: {
					add: true, // add new items by double tapping
					updateTime: true, // drag items horizontally
					updateGroup: false, // drag items from one group to another
					remove: true, // delete an item by tapping the delete button top right
					overrideItems: false // allow these options to override item.editable
				},
				groupEditable: false,
				start: min_date,
				end: max_date,
				tooltip: {
					followMouse: true
				}
			}, _defineProperty(_options, 'editable', true), _defineProperty(_options, 'format', {
				majorLabels: {
					minute: 'dddd D MMMM',
					hour: 'dddd D MMMM'
				}
			}), _options);
			var timeline = new vis.Timeline(container);
			timeline.setOptions(options);
			timeline.setGroups(groups);
			timeline.setItems(items);
		}
	}]);

	return _class;
}();
