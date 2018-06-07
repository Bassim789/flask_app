import Page from 'Page'
import parts from 'globals'
Page.add({
	page_name: 'profil',
	page_from_backend: true,
	data_from_backend: false,
	only_user_logged: true,
	events: {
		click: {
			delete_data_click(elem){
				let box = $(elem).parent()
				let id_data = box.data('id_data')
				let msg = "Veux-tu vraiment supprimer cette donnée?<br>"
				app.confirm(msg, () => {
					box.hide()
					$.api_php('public/variable', 'delete_data', {
						id_data: id_data
					}, (data) => {
						console.log(data)
						this.load_total_data()
					})
				})
			},
		},
		change: {
			input_date_change(){
				this.load_total_data()
			},
		},
	},
	init(){
		this.add_data_info = new parts.add_data_info(this)
		this.search_variable = new parts.search_variable(this)
		$('#data_total_box').template('data_total', {
			current_date: moment().format('YYYY-MM-DD')
		})
		this.load_total_data()
	},
	load_total_data(){
		this.get_data_total((data) => {
			let data_entries = data.data
			$.each(data_entries, (i, data_entry) => {
				let moment_start = moment.unix(data_entry.time_start)
				let moment_end = moment.unix(data_entry.time_end)
				data_entries[i].start = moment_start.format('YYYY-MM-DD HH:mm:ss')
				data_entries[i].end = moment_end.format('YYYY-MM-DD HH:mm:ss')
				let duration = moment.duration(moment_end.diff(moment_start))
				let duration_str = duration.format("HH:mm:ss")
				if(duration_str === '00') duration_str = '00:00:00'
				if(duration_str.length < 7) duration_str = '00:' + duration_str
				if(duration_str.length < 7) duration_str = '00:' + duration_str
				data_entries[i].duration = duration_str
				data_entries[i].duration_clean = this.readable_duration(
					duration._milliseconds)
			})
			$('#data_total_data_box').template('data_total_data', {
				data: data_entries
			})
			this.init_datetimepicker()
			$('#data_total_start_date').datepicker()
			$('#data_total_end_date').datepicker()
		})
	},
	readable_duration(duration_ms){
		return humanizeDuration(duration_ms, {
			language: 'fr',
			round: true,
			spacer: ' ',
			units: ['h', 'm', 's']
		})
	},
	get_data_total(callback){
		let start_date = moment($('#data_total_start_date').val(), 'YYYY-MM-DD')
		let start_date_unix = start_date.unix()
		let end_date_unix
		if($('#data_total_end_date').val() === ''){
			end_date_unix = start_date.add(1, 'day').unix()
		} else {
			let end_date = moment($('#data_total_end_date').val(), 'YYYY-MM-DD')
			end_date_unix = end_date.add(1, 'day').unix()
		}
		$.api('api/variable', 'get_data_total', {
			start_date_unix: start_date_unix,
			end_date_unix: end_date_unix
		}, (data) => {
			if(callback) callback(data)
		})
	},
	get_range_from_box_id(id){
		let start_date = moment($('#data_total_start_date').val(), 'YYYY-MM-DD')
		let start_date_unix = start_date.unix()
		let end_date_unix = false
		if($('#data_total_end_date').val() === ''){
			end_date_unix = start_date.add(1, 'day').unix()
		} else {
			let end_date = moment($('#data_total_end_date').val(), 'YYYY-MM-DD')
			end_date_unix = end_date.add(1, 'day').unix()
		}
	},
	get_unix_from_input_id(){

	},
	init_datetimepicker(){
		$("#dtBox").DateTimePicker({
			dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
			timeFormat: "HH:mm:ss",
			shortDayNames: [	"Dimanche", "Lundi", "Mardi", "Mercredi", 
								"Jeudi", "Vendredi", "Samedi"],
			shortMonthNames: [	"Jan", "Fev", "Mar", "Apv", "Mai", "Juin", 
								"Juil", "Aout", "Sept", "Oct", "Nov", "Dec"],
			fullMonthNames: [	"Janvier", "Fevrier", "Mars", "Avril", "Mai", 
								"Juin", "Juillet", "Aout", "Septembre", 
								"Octobre", "Novembre", "Decembre"],
			showHeader: true,
			titleContentDateTime: "",
			titleContentTime: "",
			buttonsToDisplay: ["SetButton"],
			setButtonContent: "OK",
			setValueInTextboxOnEveryClick: true,
			incrementButtonContent: "&#9650;",
			decrementButtonContent: "&#9660;",
			labels: {
				"year": "Année",
				"month": "Mois", 
				"day": "Jour", 
				"hour": "Heu.", 
				"minutes": "Min.", 
				"seconds": "Sec."
			}
		})
	},
})