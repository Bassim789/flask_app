export default class Watcher{
	constructor(){
		this.url = '//:3013'
		if (gvar.watcher) this.connect()
	}
	connect(){
		this.socket = io.connect(this.url, {reconnection: false})
		this.event()
		console.log(this.socket)
	}
	event(){
		this.socket.on('file_updated', (data) => {
			console.log('file_updated')
			console.log(data.file_name)
	        this.reload(data.file_name)
	    })
	}
	reload_css(file){
		var name = /compiled/ + file.split('/compiled/')[1].split('.css')[0]
		var queryString = '?reload=' + new Date().getTime()
		$('link[rel="stylesheet"]').each(function(){
			if (this.href.includes(name)){
				this.href = this.href.replace(/\?.*|$/, queryString)
			}
		})
	}
	reload(file){
		if (file.endsWith('.css')){
			this.reload_css(file)
		} else {
			location.reload()
		}
	}
}