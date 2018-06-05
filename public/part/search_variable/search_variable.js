import parts from 'globals'
parts.search_variable = class{
	constructor(page){
		this.page = page
		this.add_data_options_selected = 0
		this.add_variable_type_selected = 0
		$('#search_variable_box').template('search_variable')
		this.get_variables()
		this.render_add_data_options()
		$('#input_add_data').select()
		new Event_binder(this, '#search_variable_box', {
			click: [
				'add_data_option_click',
				'add_variable_click',
				'add_variable_type_click'],
			keyup: [
				'input_add_data_keyup'],
		})
	}
	input_add_data_enter(){
		let elem = $('#add_data_options').find('.selected')
		let var_name = $(elem).html().trim()
		if(var_name.indexOf('Ajouter variable:') == 0){
			this.add_variable_type_selected = 0
			this.add_data_options_selected = 0
			this.page.add_data_info.hide()
			if($('#add_variable_types').css('display') === 'block'){
				let elem = $('#add_variable_types').find('.selected')
				this.add_variable_type_click(elem)
				return false
			}
			$('#add_variable_types').show()
			this.select_variable_type()
			this.render_add_data_options()
		} else {
			this.page.add_data_info.show()
			$('#add_variable_types').hide()
			$('#input_add_data').val(var_name)
			this.show_selected_variable()
		}
	}
	show_selected_variable(){
		let var_name = $('#add_data_options').find('.selected').html().trim()
		let variable_data = false
		$.each(this.variables, (i, variable) => {
			if (variable.name.toLowerCase() === var_name.toLowerCase()){
				variable_data = variable
			}
		})
		$('#add_data_options').template('data_options', {
			add_variable: false,
			name: false,
			options: [variable_data]
		})
		this.select_option()
	}
	add_variable_type_click(elem){
		let type = $(elem).data('type_name').trim()
		let var_name = $('#input_add_data').val().trim()
		this.render_add_data_options()
		$('#add_variable_types').hide()
		$.api_php('public/variable', 'add_variable', {
			type: type,
			name: var_name
		}, (data) => {
			this.add_data_options_selected = 0
			this.get_variables(() => {
				let options = $('#add_data_options').find('.add_data_option')
				$.each(options, (i, option) => {
					console.log($(option).html().trim())
					if ($(option).html().trim().toLowerCase() === var_name.toLowerCase()){
						$(option).click()
					}
				})
			})
		})
	}
	input_add_data_keyup(elem, event){
		if (event.keyCode === 38){
			this.add_data_option_up()
		} else if (event.keyCode === 40){
			this.add_data_option_down()
		} else if (event.keyCode === 13){
			this.input_add_data_enter()
		} else {
			this.add_data_options_selected = 0
			this.render_add_data_options()
			$('#add_variable_types').hide()
			this.page.add_data_info.hide()
		}
	}
	show_only_add_variable(){
		let var_name = $('#input_add_data').val().trim()
		$('#add_data_options').template('data_options', {
			add_variable: true,
			name: var_name,
			options: []
		})
	}
	add_data_option_up(){
		$('#input_add_data')[0].setSelectionRange(99999, 99999)
		this.add_variable_type_selected -= 1
		this.add_data_options_selected -= 1
		let var_name = $('#input_add_data').val().trim()
		this.render_add_data_options()
		this.select_variable_type()
	}
	add_data_option_down(){
		this.add_variable_type_selected += 1
		this.add_data_options_selected += 1
		let var_name = $('#input_add_data').val().trim()
		this.render_add_data_options()
		this.select_variable_type()
	}
	add_data_option_click(elem){
		let options = $('#add_data_options').find('.add_data_option')
		let var_name = $(elem).html().trim()
		$.each(options, (i, option) => {
			if ($(option).html().trim().toLowerCase() === var_name.toLowerCase()){
				$(option).addClass('selected')
			} else {
				$(option).removeClass('selected')
				$(option).hide()
			}
		})
		options = $('#add_data_options').find('.add_data_option')
		$('#input_add_data').val(var_name)
		this.show_selected_variable()
		$('#add_variable_types').hide()
		this.page.add_data_info.show()
	}
	add_variable_click(elem){
		let var_name = $('#input_add_data').val().trim()
		$('#add_variable_types').show()
		this.page.add_data_info.hide()
		this.add_variable_type_selected = 0
		this.add_data_options_selected = 0
		this.render_add_data_options()
		this.select_variable_type()
	}
	get_variables(callback){
		$.api_php('public/variable', 'get_all_variables', {}, (data) => {
			console.log(data)
			this.variables = data.variables
			this.render_add_data_options()
			if(callback) callback()
		})
	}
	select_variable_type(){
		let types = $('#add_variable_types').find('.add_variable_type')
		if(this.add_variable_type_selected === 0){
			this.add_variable_type_selected = types.length
		}
		$.each(types, (i, type) => {
			if (i === Math.abs(this.add_variable_type_selected % types.length)){
				$(type).addClass('selected')
			} else {
				$(type).removeClass('selected')
			}
		})
	}
	select_option(){
		let options = $('#add_data_options').find('.add_data_option')
		if(this.add_data_options_selected === 0){
			this.add_data_options_selected = options.length
		}
		$.each(options, (i, option) => {
			if (i === this.add_data_options_selected % options.length){
				$(option).addClass('selected')
			} else {
				$(option).removeClass('selected')
			}
		})
	}
	get_options(var_name){
		let options = []
		$.each(this.variables, (i, variable) => {
			if(variable.name.toLowerCase().indexOf(var_name.toLowerCase()) == 0){
				options.push(variable)
			}
		})
		return options
	}
	get_add_variable(var_name){
		let add_variable = true
		if(var_name === '') add_variable = false
		$.each(this.variables, (i, variable) => {
			if(variable.name.toLowerCase() === var_name.toLowerCase()){
				add_variable = false
			}
		})
		return add_variable
	}
	render_add_data_options(){
		let var_name = $('#input_add_data').val().trim()
		let options = this.get_options(var_name)
		let add_variable = this.get_add_variable(var_name)
		$('#add_data_options').template('data_options', {
			add_variable: add_variable,
			name: var_name,
			options: options
		})
		this.select_option()
		if($('#add_variable_types').css('display') === 'block'){
			this.show_only_add_variable()
		}
	}
	reset(){
		$('#input_add_data').val('').select().keyup()
	}
}