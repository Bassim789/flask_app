
function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('./public/', true, /\.styl$/))
requireAll(require.context('./app/styl/', true, /\.styl$/))
requireAll(require.context('./public/', true, /\.js$/))
//requireAll(require.context('../app/app/', true, /\.js$/))

import extend_jquery from 'mustache_wrapper'
extend_jquery($)

import extend_jquery_api from 'api'
extend_jquery_api($)


import App from 'app'
import Body from 'body'
import Page from 'Page'

let msg = 'hello webpack 4'
console.log(msg)

$(function(){
	window.app = new App()
	app.router.load_page()
})