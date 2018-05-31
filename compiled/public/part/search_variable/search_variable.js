'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

parts.search_variable = function () {
	function _class(page) {
		_classCallCheck(this, _class);

		this.page = page;
		this.add_data_options_selected = 0;
		this.add_variable_type_selected = 0;
		$('#search_variable_box').template('search_variable');
		this.get_variables();
		this.render_add_data_options();
		$('#input_add_data').select();
		new Event_binder(this, '#search_variable_box', {
			click: ['add_data_option_click', 'add_variable_click', 'add_variable_type_click'],
			keyup: ['input_add_data_keyup']
		});
	}

	_createClass(_class, [{
		key: 'input_add_data_enter',
		value: function input_add_data_enter() {
			var elem = $('#add_data_options').find('.selected');
			var var_name = $(elem).html().trim();
			if (var_name.indexOf('Ajouter variable:') == 0) {
				this.add_variable_type_selected = 0;
				this.add_data_options_selected = 0;
				this.page.add_data_info.hide();
				if ($('#add_variable_types').css('display') === 'block') {
					var _elem = $('#add_variable_types').find('.selected');
					this.add_variable_type_click(_elem);
					return false;
				}
				$('#add_variable_types').show();
				this.select_variable_type();
				this.render_add_data_options();
			} else {
				this.page.add_data_info.show();
				$('#add_variable_types').hide();
				$('#input_add_data').val(var_name);
				this.show_selected_variable();
			}
		}
	}, {
		key: 'show_selected_variable',
		value: function show_selected_variable() {
			var var_name = $('#add_data_options').find('.selected').html().trim();
			var variable_data = false;
			$.each(this.variables, function (i, variable) {
				if (variable.name.toLowerCase() === var_name.toLowerCase()) {
					variable_data = variable;
				}
			});
			$('#add_data_options').template('data_options', {
				add_variable: false,
				name: false,
				options: [variable_data]
			});
			this.select_option();
		}
	}, {
		key: 'add_variable_type_click',
		value: function add_variable_type_click(elem) {
			var _this = this;

			var type = $(elem).data('type_name').trim();
			var var_name = $('#input_add_data').val().trim();
			this.render_add_data_options();
			$('#add_variable_types').hide();
			$.api_php('public/variable', 'add_variable', {
				type: type,
				name: var_name
			}, function (data) {
				_this.add_data_options_selected = 0;
				_this.get_variables(function () {
					var options = $('#add_data_options').find('.add_data_option');
					$.each(options, function (i, option) {
						console.log($(option).html().trim());
						if ($(option).html().trim().toLowerCase() === var_name.toLowerCase()) {
							$(option).click();
						}
					});
				});
			});
		}
	}, {
		key: 'input_add_data_keyup',
		value: function input_add_data_keyup(elem, event) {
			if (event.keyCode === 38) {
				this.add_data_option_up();
			} else if (event.keyCode === 40) {
				this.add_data_option_down();
			} else if (event.keyCode === 13) {
				this.input_add_data_enter();
			} else {
				this.add_data_options_selected = 0;
				this.render_add_data_options();
				$('#add_variable_types').hide();
				this.page.add_data_info.hide();
			}
		}
	}, {
		key: 'show_only_add_variable',
		value: function show_only_add_variable() {
			var var_name = $('#input_add_data').val().trim();
			$('#add_data_options').template('data_options', {
				add_variable: true,
				name: var_name,
				options: []
			});
		}
	}, {
		key: 'add_data_option_up',
		value: function add_data_option_up() {
			$('#input_add_data')[0].setSelectionRange(99999, 99999);
			this.add_variable_type_selected -= 1;
			this.add_data_options_selected -= 1;
			var var_name = $('#input_add_data').val().trim();
			this.render_add_data_options();
			this.select_variable_type();
		}
	}, {
		key: 'add_data_option_down',
		value: function add_data_option_down() {
			this.add_variable_type_selected += 1;
			this.add_data_options_selected += 1;
			var var_name = $('#input_add_data').val().trim();
			this.render_add_data_options();
			this.select_variable_type();
		}
	}, {
		key: 'add_data_option_click',
		value: function add_data_option_click(elem) {
			var options = $('#add_data_options').find('.add_data_option');
			var var_name = $(elem).html().trim();
			$.each(options, function (i, option) {
				if ($(option).html().trim().toLowerCase() === var_name.toLowerCase()) {
					$(option).addClass('selected');
				} else {
					$(option).removeClass('selected');
					$(option).hide();
				}
			});
			options = $('#add_data_options').find('.add_data_option');
			$('#input_add_data').val(var_name);
			this.show_selected_variable();
			$('#add_variable_types').hide();
			this.page.add_data_info.show();
		}
	}, {
		key: 'add_variable_click',
		value: function add_variable_click(elem) {
			var var_name = $('#input_add_data').val().trim();
			$('#add_variable_types').show();
			this.page.add_data_info.hide();
			this.add_variable_type_selected = 0;
			this.add_data_options_selected = 0;
			this.render_add_data_options();
			this.select_variable_type();
		}
	}, {
		key: 'get_variables',
		value: function get_variables(callback) {
			var _this2 = this;

			$.api_php('public/variable', 'get_all_variables', {}, function (data) {
				console.log(data);
				_this2.variables = data.variables;
				_this2.render_add_data_options();
				if (callback) callback();
			});
		}
	}, {
		key: 'select_variable_type',
		value: function select_variable_type() {
			var _this3 = this;

			var types = $('#add_variable_types').find('.add_variable_type');
			if (this.add_variable_type_selected === 0) {
				this.add_variable_type_selected = types.length;
			}
			$.each(types, function (i, type) {
				if (i === Math.abs(_this3.add_variable_type_selected % types.length)) {
					$(type).addClass('selected');
				} else {
					$(type).removeClass('selected');
				}
			});
		}
	}, {
		key: 'select_option',
		value: function select_option() {
			var _this4 = this;

			var options = $('#add_data_options').find('.add_data_option');
			if (this.add_data_options_selected === 0) {
				this.add_data_options_selected = options.length;
			}
			$.each(options, function (i, option) {
				if (i === _this4.add_data_options_selected % options.length) {
					$(option).addClass('selected');
				} else {
					$(option).removeClass('selected');
				}
			});
		}
	}, {
		key: 'get_options',
		value: function get_options(var_name) {
			var options = [];
			$.each(this.variables, function (i, variable) {
				if (variable.name.toLowerCase().indexOf(var_name.toLowerCase()) == 0) {
					options.push(variable);
				}
			});
			return options;
		}
	}, {
		key: 'get_add_variable',
		value: function get_add_variable(var_name) {
			var add_variable = true;
			if (var_name === '') add_variable = false;
			$.each(this.variables, function (i, variable) {
				if (variable.name.toLowerCase() === var_name.toLowerCase()) {
					add_variable = false;
				}
			});
			return add_variable;
		}
	}, {
		key: 'render_add_data_options',
		value: function render_add_data_options() {
			var var_name = $('#input_add_data').val().trim();
			var options = this.get_options(var_name);
			var add_variable = this.get_add_variable(var_name);
			$('#add_data_options').template('data_options', {
				add_variable: add_variable,
				name: var_name,
				options: options
			});
			this.select_option();
			if ($('#add_variable_types').css('display') === 'block') {
				this.show_only_add_variable();
			}
		}
	}, {
		key: 'reset',
		value: function reset() {
			$('#input_add_data').val('').select().keyup();
		}
	}]);

	return _class;
}();
