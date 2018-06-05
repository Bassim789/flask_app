import pages from 'globals'
export default class Router {
	constructor(domain) {
		this.domain = domain
		$(window).on('popstate', () => this.popstate())
	}
	get_url_param(param) {
		let page_url = decodeURIComponent(window.location.search.substring(1)),
			url_vars = page_url.split('&')
		for (let i = 0; i < url_vars.length; i++) {
			let param_name = url_vars[i].split('=')
			if (param_name[0] === param) {
				return param_name[1] === undefined ? false : param_name[1]
			}
		}
		return false
	}
	change_page(page) {
		window.history.pushState('', '', this.domain + page)
		this.load_page()
		$(window).scrollTop()
	}
	convert_arg_to_path(){
		let new_url = window.location.href
			.replace('?page=', '')
			.replace('&', '?')
		window.history.replaceState('', '', new_url)
	}
	load_page() {
		if (this.get_url_param('page')) this.convert_arg_to_path()
		let page_name = location.pathname
			.split(this.domain)[1]
			.replace(/\//g,'')
		page_name = page_name === '' ? 'index' : page_name
		console.log(pages)
		if(pages[page_name] === undefined) return false
		new pages[page_name]()	
	}
	popstate() {
		this.load_page()
	}
}