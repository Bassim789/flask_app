import Header from 'header/header'
import Body from 'body'
import Watcher from 'watcher'
import Router from 'router'
export default class App {
	constructor(){
		this.header = new Header()
		this.body = new Body()
		this.watcher = new Watcher()
		this.router = new Router('/')
		$('body').on('submit', 'form', () => false)
	}
	change_page(page){
		this.router.change_page(page)
	}
	confirm(msg, callback){
		$.confirm(msg, (valided) => {if(valided) callback()})
	}
}