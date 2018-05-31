class Watcher{
	constructor(data){
		this.root = data.root
		this.folder_compiled = data.folder_compiled
		this.folders = data.folders
		this.nb_file = 0
		this.nb_styl = 0
		this.nb_folder_started = 0
		this.watched_folders = false
		this.connect('newapp2.simergie.ch')
		this.exec = require('child_process').exec
		this.fs = require('fs')
		this.watcher(this.folders)
		this.check_new_sub_folders(this.folders)
		setInterval(() => { 
			this.check_new_sub_folders(this.folders)
		}, 5000)
	}
	connect(domain){
		const port = 3013
		const fs = require('fs')
		const app = require('express')()
		const server = require('https').createServer({
			key: fs.readFileSync('/etc/letsencrypt/live/' + domain + '/privkey.pem'),
			cert: fs.readFileSync('/etc/letsencrypt/live/' + domain + '/fullchain.pem'),
			requestCert: false,
			rejectUnauthorized: false
		}, app)
		this.io = require('socket.io').listen(server)
		server.listen(port, () => {
			console.log('Watcher running on port ' + port)
		})
		console.log('socket connexion')
	}
	watcher(folders){
		const chokidar = require('chokidar')
		const walk = require('walk')
		this.watcher = chokidar.watch('file, dir, glob, or array', {ignored: /[\/\\]\./, persistent: true})
		this.watcher.on('change', (path, stats) => this.update(path))
		for (var i in folders) {
			let walker = walk.walk(this.root + folders[i], { followLinks: false })
			walker.on('file', (root, stat, next) => {
				if (stat.name.endsWith('.html') ||
					stat.name.endsWith('.js') ||
					stat.name.endsWith('.css') ||
					stat.name.endsWith('.styl'))
				{
					let path_and_file = root + '/' + stat.name
					this.watcher.add(path_and_file)
					console.log(path_and_file)
					this.nb_file += 1
				}
				if (stat.name.endsWith('.styl')) {
					this.nb_styl += 1
				}
				next()
			})
			walker.on('end', () => {
				this.nb_folder_started += 1
				if (this.nb_folder_started === folders.length) {
					console.log(`${this.nb_file} files watched and ${this.nb_styl} stylus live compiled`)
				}
			})
		}
	}
	force_directory_sync(directory) {  
		if (!this.fs.existsSync(directory)){
			let parent_dir = directory.substring(0, directory.slice(0, -1).lastIndexOf('/') + 1)
			this.force_directory_sync(parent_dir)
			this.fs.mkdirSync(directory)
		}
	}
	update(file){
		console.log('update file: ' + file)
		if (file.endsWith('.styl')){
			const path = file.substring(0, file.lastIndexOf('/') + 1),
				root_compiled = this.root + this.folder_compiled + '/',
				path_compiled = root_compiled + path.split(this.root)[1]
			this.force_directory_sync(path_compiled)
			this.exec(`stylus ${file} --out ${path_compiled}`, (e, stdout, stderr) => {
				if (stderr) console.log(stderr)
				console.log(stdout)
				let css_file = path_compiled + file.substring(file.lastIndexOf('/') + 1)
				css_file = css_file.replace('.styl', '.css')
				this.io.sockets.emit('file_updated', {file_name: css_file})
			})
		} else {
			this.io.sockets.emit('file_updated', {file_name: file})
		}
	}
	check_new_sub_folders(folders){
		if(this.watched_folders){
			folders.forEach(folder => {
				this.check_folder(this.root + folder, true)
			})
		} else {
			this.watched_folders = []
			folders.forEach(folder => {
				this.check_folder(this.root + folder, false)
			})
		}
	}
	check_folder(folder, compare){
		this.fs.stat(folder, (err, stats) => {
			if(!stats) return false
			if(stats.isDirectory()){
				this.fs.readdir(folder, (err, files) => {
					files.forEach(file => {
						let path_file = folder + '/' + file
						this.check_folder(path_file, compare)
					})
				})
			} else if(!this.watched_folders.includes(folder)){
				this.watched_folders.push(folder)
				if(compare){
					console.log('add new file: ' + folder)
					this.watcher.add(folder)
				}
			}
		})
	}
}
const watcher = new Watcher({
	root: '/var/www/flask_app/',
	folder_compiled: 'compiled',
	folders: [
		'public',
		'app/app'
	]
})
