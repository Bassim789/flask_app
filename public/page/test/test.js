Page.add({
	page_name: 'test',
	page_from_backend: true,
	data_from_backend: true,
	my_name: 'bassim',
	data: {
		name: 'test',
		age: 29,
	},
	events: {
		click: {
			first_test(){
				this.success()
			},
		},
	},
	success(){
		this.data.name = 'YO! ' + this.data.name
		this.render()
	},
})