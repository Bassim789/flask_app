'use strict';

Page.add({
	page_name: 'todo',
	page_from_backend: true,
	data_from_backend: true,
	only_user_logged: true,
	data: {},
	events: {
		click: {
			btn_add_category: function btn_add_category(elem) {
				this.add_category(elem);
			},
			btn_popup_add_action: function btn_popup_add_action(elem) {
				this.popup_add_action($(elem).parent().parent());
			},
			btn_add_action: function btn_add_action(elem) {
				this.add_action(elem);
			},
			btn_action_done: function btn_action_done() {},
			btn_remove_action: function btn_remove_action(elem) {
				this.remove_action(elem);
			},
			btn_popup_add_category: function btn_popup_add_category() {
				this.popup_add_category();
			},
			btn_close_popup: function btn_close_popup(elem) {
				$(elem).parent().hide();
			},
			btn_remove_category: function btn_remove_category(elem) {
				this.remove_category(elem);
			}
		},
		enter: {
			input_add_category: function input_add_category(elem) {
				this.add_category(elem);
			}
		},
		keyup: {
			input_time_done: function input_time_done(elem) {
				console.log('change');
				this.update_time_done(elem);
			}
		}
	},
	add_category: function add_category(elem) {
		var category_data = $(elem).parent().serialize();
		$.api_page('this', 'add_category', category_data, function (data) {
			console.log(data);
			window.location.reload();
		});
	},
	popup_add_action: function popup_add_action(elem) {
		$('#form_add_action').show();
		var category_id = $(elem).data('category_id');
		$('#form_add_action').find('#category_id').val(category_id);
	},
	add_action: function add_action(elem) {
		var action_data = $(elem).parent().serialize();
		$.api_page('this', 'add_action', action_data, function (data) {
			console.log(data);
			window.location.reload();
		});
	},
	remove_action: function remove_action(elem) {
		var action_id = $(elem).parent().parent().data('action_id');
		$.api_page('this', 'remove_action', { action_id: action_id }, function (data) {
			console.log(data);
			window.location.reload();
		});
	},
	update_time_done: function update_time_done(elem) {
		var parent = $(elem).parent().parent();
		var action_data = {
			action_id: parent.data('action_id'),
			time_done_hour: parent.find('.time_done_hour').val(),
			time_done_minute: parent.find('.time_done_minute').val()
		};
		console.log(action_data);
		$.api_page('this', 'update_time_done', action_data, function (data) {
			console.log(data);
		});
	},
	popup_add_category: function popup_add_category() {
		$('#form_add_category').show();
	},
	remove_category: function remove_category(elem) {
		var category_id = $(elem).parent().parent().data('category_id');
		$.api_page('this', 'remove_category', { category_id: category_id }, function (data) {
			console.log(data);
			window.location.reload();
		});
	}
});
