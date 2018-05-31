Page.add({
	page_name: 'index',
	page_from_backend: true,
	data_from_backend: false,
	sitekey: '6LfxBDIUAAAAAAzjMtV266_Bud20ztGI9vm58SUC',
	events: {
		click: {
			inscription_clicked(){
				this.open_popup('popup_inscription')
				const captchaContainer = grecaptcha.render('g-recaptcha', {
					sitekey: this.sitekey,
					callback: (response) => {
						console.log(response)
					}
				})
			},
			connexion_clicked(){
				this.open_popup('popup_connexion')
			},
			close_popup(){
				$('#popup_box').html('')
			},
			signin_submit_btn(){
				this.signin_submit()
			},
			connexion_submit_btn(){
				this.connexion_submit()
			},
		},
		enter: {
			connexion_submit_enter(){
				this.connexion_submit()
			},
			resent_password_enter(){
				this.resent_password()
			},
		},
	},
	init(){
		if(gvar.user.is_logged){
			app.change_page('todo')
			return false
		}
	},
	open_popup(type){
		let content = $.get_template(type)
		$('#popup_box').template('popup', {content: content})
	},
	resent_password(){
		$('.loading_balls').show()
		$('#error_forgot_password').html('')
		let error = false
		const email = $('#email_forgot_password').val()
		$.api_php('public/login', 'resend_password', {
			email: email
		}, (data) => {
			console.log(data)
			if (data.res === 'ok'){
				$('#forgot_password').hide()
				$('#message_password_resent').show()
			} else if (data.error === 'wrong_email'){
	            error = "L'email est incorrect"
	            $('#error_forgot_password').html(error)
	        }
			$('.loading_balls').hide()
		})
	},
	connexion_submit(){
		$('.loading_balls').show()
		$('#error_connexion').html('')
		let error = false
		const email = $('#email_connexion').val()
		const password = $('#password_connexion').val()
		const remember = $('#connexion_remember').val()
		$.api_php('public/login', 'connexion', {
			email: email,
			password: password,
			remember: remember
		}, (data) => {
			if (data.res === 'ok'){
				gvar.user.is_admin = data.is_admin
				gvar.user.is_logged = true
				gvar.user.session_hash = data.session_hash
				gvar.user.email = data.email
				app.change_page('todo')
				app.header.load()
			} else if (data.error === 'wrong_email'){
	            error = "L'email est incorrect"
	        } else if (data.error === 'wrong_password'){
	            error = "Mot de passe invalide"
	        } else if (data.error === 'account_not_activate'){
	            error = "Compte non activé"
	        }
	        console.log(data)
        	$('#popup_response').html(error).attr('class', 'popup_response_error')
			$('.loading_balls').hide()
		})
	},
	signin_submit(){
		$('.loading_balls').show()
		$('#error_signin').html('')
		let error = false
		const email = $('#email_signin').val()
		const password = $('#password_signin').val()
		const erreurAffiche = $('#error_signin').html()
		const captcha = $('#g-recaptcha-response').val()
		if (email === ''){
			error = "Tu dois indiquer ton email"
		}
		if (password === ''){
			error = "Tu dois indiquer un mot de passe"
		}
		if (error){
			$('.loading_balls').hide()
			$('#popup_response').html(error).attr('class', 'popup_response_error')
			return false
		}
		$.api_php('public/login', 'signin_new_user', {
			email: email,
			password: password,
			captcha: captcha
		}, (data) => {
			console.log(data)
			if (data.res === 'ok'){
				$('#signin').hide()
				$('.loading_balls').hide()
				$('#message').show()
				let msg = 'Inscription réussie, veuillez valider l\'email de confirmation.'
				$('#popup_response').html(msg).attr('class', 'popup_response_valid')
				return false
			}
			if (data.error === 'wrong_captcha'){
	            error = "Le Captcha est incorrect"
	        } else if (data.error === 'already_exist'){
	            error = "Cette adresse email est déjà enregistrée"
	        }
	        $('#popup_response').html(error).attr('class', 'popup_response_error')
	        $('.loading_balls').hide()
		})
	},
})