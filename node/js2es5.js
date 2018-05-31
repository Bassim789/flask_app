class Js2es5 {
	constructor(data) {
		this.root = data.root
		this.folder_compiled = data.folder_compiled
		this.folders = data.folders
		this.exec = require('child_process').exec
		this.walk = require('walk')
		this.fs = require('fs')
		this.files = []
		this.nb_folder_started = 0
		this.nb_file_done = 0
		this.run()
		this.start_time = new Date()
	}
	force_directory_sync(directory) {  
		if (!this.fs.existsSync(directory)){
			let parent_dir = directory.substring(0, directory.slice(0, -1).lastIndexOf('/') + 1)
			this.force_directory_sync(parent_dir)
			this.fs.mkdirSync(directory)
		}
	}
	puts(error, stdout, stderr) {
		let that = js2es5
		that.nb_file_done += 1
		if (stderr) console.log(stderr)
		if (error) console.log(error)
		let filename = stdout.trim()
		let time = (new Date() - that.start_time) / 1000
		console.log(filename + ' ' + time + 's')
	}
	run() {
		for (let i in this.folders) {
			const walker = this.walk.walk(this.root + this.folders[i], { followLinks: false })
			walker.on('file', (root, stat, next) => {
				if (stat.name.endsWith('.js')) {
					let path_and_file = root + '/' + stat.name,
						root_compiled = this.root + this.folder_compiled + '/',
						path_compiled = root_compiled + root.split(this.root)[1] + '/',
						path_and_file_compiled = path_compiled + stat.name
					this.force_directory_sync(path_compiled)
					this.exec(
						`babel ${path_and_file} --out-file ${path_and_file_compiled};
						echo ${stat.name}`,
						this.puts
					)
					this.files.push(root + '/' + stat.name)
				}
				setTimeout(() => next(), 1000)
			})
			walker.on('end', () => {
				this.nb_folder_started += 1
				if (this.nb_folder_started === this.folders.length) {
					console.log(this.files.length + ' files compiled')
				}
			})
		}
	}
}
const js2es5 = new Js2es5({
	root: './',
	folder_compiled: 'compiled',
	folders: [
		'public',
		'app/app'
	]
})