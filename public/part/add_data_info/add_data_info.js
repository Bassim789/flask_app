import parts from 'globals'
import Event_binder from 'event_binder'
parts.add_data_info = class{
	constructor(page){
		this.page = page
		$('#add_data_info_box').template('add_data_info')
		new Event_binder(this, '#add_data_info_box', {
			click: [
				'add_data_save_click',
				'delete_variable_click'],
			change: [
				'input_time_change']
		})
	}
	delete_variable_click(){
		let var_name = $('#input_add_data').val().trim()
		let msg = "Veux-tu vraiment supprimer cette variable?<br>"
		msg += "<strong>" + var_name + "</strong>"
		app.confirm(msg, () => {
			$('#input_add_data').val('').keyup()
			$.api_php('public/variable', 'delete_variable', {
				name: var_name
			}, (data) => {
				this.page.search_variable.get_variables()
				$('#input_add_data').keyup()
				this.page.load_total_data()
			})
		})
	}
	add_data_save_click(){
		console.log('add_data_save_click()')
		let var_name = $('#input_add_data').val().trim()
		let time_start = $('#input_start_time').val()
		let time_last = $('#input_time_last').val()
		let time_end = $('#input_end_time').val()
		$.api_php('public/variable', 'add_data', {
			var_name: var_name,
			time_start: time_start,
			time_last: time_last,
			time_end: time_end
		}, (data) => {
			console.log(data)
			this.page.search_variable.reset()
			this.page.load_total_data()
		})
	}
	input_time_change(elem){
		let elem_id = $(elem).attr('id')
		if(elem_id === 'input_start_time'){
			this.set_time_last()
		} else if (elem_id === 'input_time_last'){
			this.set_time_end()
			this.update_clean_duration()
		} else if (elem_id === 'input_end_time'){
			this.set_time_last()
		}
	}
	set_time_last(){
		let moment_start = moment($('#input_start_time').val())
		let moment_end = moment($('#input_end_time').val())
		let duration = moment.duration(moment_end.diff(moment_start))
		let duration_str = duration.format("HH:mm:ss")
		if(duration_str === '00') duration_str = '00:00:00'
		$('#input_time_last').val(duration_str)
		this.update_clean_duration()
	}
	set_time_end(){
		let moment_start = moment($('#input_start_time').val())
		let duration_str = $('#input_time_last').val()
		let duration_in_seconde = this.time_last_to_second(duration_str)
		let moment_end = moment_start.add(duration_in_seconde, 's')
		let moment_end_str = moment_end.format("YYYY-MM-DD HH:mm:ss")
		$('#input_end_time').val(moment_end_str)
	}
	time_last_to_second(time_str){
		let time_parts = time_str.split(':')
		return parseInt(time_parts[0]) * 3600 + parseInt(time_parts[1]) * 60 + parseInt(time_parts[2])
	}
	show(){
		$('#add_data_info').show()
		this.init_datetimepicker()
		let actual_date_str = moment().format("YYYY-MM-DD HH:mm:ss")
		$('#input_start_time').val(actual_date_str)
		$('#input_end_time').val(actual_date_str)
		$('#input_time_last').val('00:00:00')
		this.update_clean_duration()
	}
	update_clean_duration(){
		let elem = $('#input_time_last')
		let duration_str = elem.val()
		let duration_ms = moment.duration(duration_str, 'HH:mm:ss')._milliseconds
		let duration_clean = this.page.readable_duration(duration_ms)
		let duration_clean_div = elem.parent().find('.duration_clean')
		duration_clean_div.html(duration_clean)
	}
	hide(){
		$('#add_data_info').hide()
	}
	init_datetimepicker(){
		this.page.init_datetimepicker()
	}
}