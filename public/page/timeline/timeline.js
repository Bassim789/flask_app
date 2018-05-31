pages.timeline = class{
	constructor(){
		$('#body').template('page_timeline', {
			start_date: moment().add(-7, 'day').format('YYYY-MM-DD'),
			end_date: moment().add(7, 'day').format('YYYY-MM-DD'),
		})
		this.init_select_range()
		this.load_timeline_data()
	}
	init_select_range(){
		$('#timeline_start_date').datepicker()
		$('#timeline_end_date').datepicker()
		new Event_binder(this, '#timeline_select_range_box', {
			change: [
				'input_date_change']
		})
	}
	input_date_change(){
		this.load_timeline_data()
	}
	unix_to_date_object(unix){
		return new Date(unix * 1000)
	}
	tooltip(tooltip_info){
		return $.get_template('timeline_tooltip', {
			var_name: tooltip_info.var_name
		})
	}
	load_timeline_data(){
		let start_date = moment($('#timeline_start_date').val(), 'YYYY-MM-DD')
		let start_date_unix = start_date.unix()
		let end_date_unix
		if($('#timeline_end_date').val() === ''){
			end_date_unix = start_date.add(14, 'day').unix()
		} else {
			let end_date = moment($('#timeline_end_date').val(), 'YYYY-MM-DD')
			end_date_unix = end_date.add(1, 'day').unix()
		}
		$.api_php('public/variable', 'get_data_timeline', {
			start_date_unix: start_date_unix,
			end_date_unix: end_date_unix
		}, (data) => {
			let timeline_data = []
			$.each(data.entries, (i, entry) => {
				let var_name = entry.var_name,
					start_date = this.unix_to_date_object(entry.time_start),
					end_date = this.unix_to_date_object(entry.time_end),
					tooltip_info = {var_name: var_name}
				timeline_data.push({
					var_name: var_name,
					tooltip: this.tooltip(tooltip_info),
					start_date: start_date,
					end_date: end_date,
					var_id: entry.id_variable
				})
			})
			if(timeline_data.length > 0){
				this.init_timeline(timeline_data)
			} else {
				$('#timeline_box').html('Aucune données pour ces dates')
			}
		})
	}
	append_style(style){
		var css = style,
			head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		head.appendChild(style);
	}
	get_readable_duration(duration_ms){
		return humanizeDuration(duration_ms, {
			language: 'fr',
			round: true,
			spacer: ' ',
			units: ['h', 'm', 's']
		})
	}
	init_timeline(timeline_data){
		let min_date = new Date(2222, 0, 1)
		let max_date = new Date(1776, 4, 1)
		let groups_data = []
		let groups_names = []
		let items_data = []
		let style = ''
		let color_num = 0
		let colors = ['#FA8072', '#B0E2FF', '#beb0ff', '#faa172', '#71bbe6', '#b0ffcd']
		let color_item = false
		timeline_data.forEach((item, i) => {
			if(item.start_date < min_date){
				min_date = item.start_date
			}
			if(item.end_date > max_date){
				max_date = item.end_date
			}
			if(color_num >= colors.length) color_num = 0
			if(!groups_names.includes(item.var_name)){
				groups_data.push({
					content: item.var_name,
					id: item.var_name, 
					value: groups_data.length + 1,
					className: 'timeline_group_' + color_num,
					color_num: color_num
				})
				groups_names.push(item.var_name)
				style += '\n.vis-item.timeline_group_' + color_num
				style += '{background: ' + colors[color_num] + ';}'
				color_num += 1
			}
			groups_data.forEach(group => {
				if(item.var_name === group.id){
					color_item = group.color_num
				}
			})
			let start_unix = item.start_date.getTime()
			let end_unix = item.end_date.getTime()
			let readable_duration = this.get_readable_duration(end_unix - start_unix)
			items_data.push({
				start: item.start_date,
				end: item.end_date,
				group: item.var_name,
				className: 'timeline_group_' + color_item, 
				content: item.var_name, 
				id: item.var_name + '_' + (i + 1),
				title: item.var_name + '<br>' + readable_duration,
				type: start_unix === end_unix ? 'box' : 'range'
			})
		})

		this.append_style(style)

		var groups = new vis.DataSet(groups_data)
		var items = new vis.DataSet(items_data)

		var container = document.getElementById('timeline_box');
		$(container).html('')
		var options = {
			groupOrder: function (a, b) {
				return a.value - b.value
			},
			groupOrderSwap: function (a, b, groups) {
				var v = a.value
				a.value = b.value
				b.value = v
			},
			onMove: (data) => {
				console.log('update')
				console.log(data)
			},
			template: function(item, element, data){
				return '<div>' + item.content + '</div>'
			},
			orientation: 'both',
			editable: {
				add: true,         // add new items by double tapping
				updateTime: true,  // drag items horizontally
				updateGroup: false, // drag items from one group to another
				remove: true,       // delete an item by tapping the delete button top right
				overrideItems: false  // allow these options to override item.editable
			},
			groupEditable: false,
			start: min_date,
			end: max_date,
			tooltip: {
				followMouse: true
			},
			editable: true,
			format: {
					majorLabels: {
					minute:     'dddd D MMMM',
					hour:       'dddd D MMMM'
				}
			}
		}
		let timeline = new vis.Timeline(container)
		timeline.setOptions(options)
		timeline.setGroups(groups)
		timeline.setItems(items)
	}
}
