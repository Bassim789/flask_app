export default class Body {
	constructor() {
		this.background = $('#background')
		this.mobile_width_limite = 600
		this.last_width = $(window).width()
		this.set_body_min_height()
		this.load_backround()
		this.event()
	}
	event() {
		$(window).resize(() => {
			if (this.last_width != $(window).width()) this.reinit()
		})
	}
	reinit() {
		this.last_width = $(window).width()
		this.set_body_min_height()
		this.load_backround()
	}
	set_body_min_height() {
		$('#body_wrap').css('min-height', $(window).height() - 50 + 'px')
		$('.full_height_box').css('min-height', $(window).height() - 50 + 'px')
	}
	load_backround() {
		let img_src = this.choose_background(),
			background = this.background
		$('<img/>').attr('src', img_src).on('load', function(){
			$(this).remove()
			background.css({
				backgroundImage: 'url(' + img_src + ')',
				height: $(window).height() + 100
			}).fadeTo(1000, 0.1)
		})
	}
	choose_background() {
		if ($(window).width() < this.mobile_width_limite) {
			return gvar.img.default_mobile
		} else {
			return gvar.img.default_desktop
		}
	}
}