import io from 'socket.io-client'
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
			console.log(data.file_type)
			console.log(data.file_name)
	        this.reload(data.file_type)
	    })
	}
	reload_css(){
		var name = '/dist/main.css'
		var queryString = '?reload=' + new Date().getTime()
		$('link[rel="stylesheet"]').each(function(){
			if (this.href.includes(name)){
				this.href = this.href.replace(/\?.*|$/, queryString)
			}
		})
	}
	reload(file_type){
		if (file_type === 'css'){
			this.reload_css()
		} else {
			//location.reload()
		}
	}
}