class Watcher{
	constructor(data){
		this.root = data.root
		this.connect('newapp2.simergie.ch')
		this.exec = require('child_process').exec
		this.fs = require('fs')
		this.watch = require('node-watch')
		this.watcher()
	}
	connect(domain){
		const port = 3013
		const fs = require('fs')
		const app = require('express')()
		// const server = require('https').createServer({
		// 	key: fs.readFileSync('/etc/letsencrypt/live/' + domain + '/privkey.pem'),
		// 	cert: fs.readFileSync('/etc/letsencrypt/live/' + domain + '/fullchain.pem'),
		// 	requestCert: false,
		// 	rejectUnauthorized: false
		// }, app)
		const server = require('http').createServer(app)
		this.io = require('socket.io').listen(server)
		server.listen(port, () => {
			console.log('Watcher running on port ' + port)
		})
		console.log('socket connexion')
	}
	watcher(){
		this.watch(this.root + 'dist/main.js', { }, (evt, name)  => {
			this.io.sockets.emit('file_updated', {file_type: 'js', file_name: name})
			console.log('%s changed.', name)
		})
		this.watch(this.root + 'dist/main.css', { }, (evt, name)  => {
			this.io.sockets.emit('file_updated', {file_type: 'css', file_name: name})
			console.log('%s changed.', name)
		})
	}
}
const watcher = new Watcher({
	root: '/var/www/flask_app/'
})
