const Watcher = class{
	constructor(){
		this.url = '//:3013'
		if (gvar.watcher) this.connect()
	}
	connect(){
		this.socket = io.connect(this.url, {reconnection: false})
		this.event()
	}
	event(){
		this.socket.on('file_updated', (data) => {
	        this.reload(data.file_name)
	    })
	}
	reload_css(file){
		var name = file.split('www/')[1].split('.css')[0]
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