$.fn.extend({
	template: function(template, data) {
		if(data === undefined) data = {}
		this.html(Mustache.render(
			$('template[template="' + template + '"]').html(), data
		))
	},
	template_append: function(template, data) {
		if(data === undefined) data = {}
		this.append(Mustache.render(
			$('template[template="' + template + '"]').html(), data
		))
	},
	template_prepend: function(template, data) {
		if(data === undefined) data = {}
		this.prepend(Mustache.render(
			$('template[template="' + template + '"]').html(), data
		))
	},
	template_page: function(template, data) {
		if(data === undefined) data = {}
		this.html(Mustache.render(
			$('template[page="' + template + '"]').html(), data
		))
	},
})

$.get_template = function(template, data) {
	if(data === undefined) data = {}
	return Mustache.render(
		$('template[template="' + template + '"]').html(), data
	)
}
export default $