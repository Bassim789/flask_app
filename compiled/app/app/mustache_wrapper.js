'use strict';

$.fn.extend({
	template: function template(_template, data) {
		if (data === undefined) data = {};
		this.html(Mustache.render($('template[template="' + _template + '"]').html(), data));
	},
	template_append: function template_append(template, data) {
		if (data === undefined) data = {};
		this.append(Mustache.render($('template[template="' + template + '"]').html(), data));
	},
	template_prepend: function template_prepend(template, data) {
		if (data === undefined) data = {};
		this.prepend(Mustache.render($('template[template="' + template + '"]').html(), data));
	},
	template_page: function template_page(template, data) {
		if (data === undefined) data = {};
		this.html(Mustache.render($('template[page="' + template + '"]').html(), data));
	}
});

$.get_template = function (template, data) {
	if (data === undefined) data = {};
	return Mustache.render($('template[template="' + template + '"]').html(), data);
};
