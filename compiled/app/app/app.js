'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function App() {
	_classCallCheck(this, App);

	this.header = new Header();
	this.body = new Body();
	this.watcher = new Watcher();
	this.router = new Router('/framework_elements/www/');
	this.router.load_page();
	$('#splash_screen').fadeOut(500);
};
