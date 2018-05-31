const Header = class {
	constructor() {
		this.sidr_width = 260
		this.sidr_transition = 200
		this.elem_to_move = [
			'header',
			'#background',
			'#body_wrap',
		]
		this.event()
		this.load()
	}
	event() {
		new Event_binder(this, 'header', {
			click: [
				'logout',
				'toggle_sidr',
				'logout_lia',
				'goto']
		})
	}
	goto(elem){
		app.change_page($(elem).attr('page'))
		this.close_sidr()
	}
	logout(){
		this.close_sidr() 
		$.api_php('public/login', 'logout', {}, (data) => {
			gvar.user.is_logged = false
			gvar.user.is_admin = false
			gvar.user.session_hash = false
			app.change_page('')
			this.load()
		})
	}
	load() {
		$('header').template('header', {
			user_is_logged: gvar.user.is_logged,
			logo: gvar.img.logo,
			email: gvar.user.email,
		})	
		this.load_backround_sidr()
	}
	load_backround_sidr() {
		$('#sidr_background').css({ backgroundImage: 'url(' + gvar.img.default_sidr + ')' })
	}
	toggle_sidr() {
		var is_closed = $('#overlay_sidebar_menu').css('display') == 'none'
		is_closed ? this.open_sidr() : this.close_sidr()
	}
	open_sidr() {
		var full_height = Math.max($(document).height(), $(window).height())
		$('#overlay_sidebar_menu')
			.show()
			.css({
				height: full_height + 'px',
				opacity: 0.0
			})
			.animate({opacity: 0.7}, this.sidr_transition)
		$.each(this.elem_to_move, (i, elem) => {
			$(elem).animate({right: this.sidr_width + "px"}, this.sidr_transition)
		})
		$('.menu_btn').animate({opacity: 0.0,}, this.sidr_transition)
	}
	close_sidr() {
		$('#overlay_sidebar_menu')
			.css({opacity: 0.7})
			.animate({opacity: 0.0}, {
				duration: this.sidr_transition,
				complete: () => {
					$('#overlay_sidebar_menu').hide()
				}
			})
		$.each(this.elem_to_move, (i, elem) => {
			$(elem).animate({right: "0px"}, this.sidr_transition)
		})
		$('.menu_btn').animate({opacity: 1.0,}, this.sidr_transition)
	}
}