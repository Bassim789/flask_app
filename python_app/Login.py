from werkzeug.security import generate_password_hash, check_password_hash
import requests
import json
import random, string
from utils import render_template
from flask_mail import Mail, Message

class Login():
	def __init__(self, db, config, app):
		self.db = db
		self.config = config
		self.app = app
	def connexion(self, email, password, remember):
		user = self.db.get_one('user', 'email', email)
		if not user: 
			return {'error_connexion': 'wrong_email'}
		if not check_password_hash(user['hash'], password):
			return {'error_connexion': 'wrong_password'}
		if remember == 'on':
			token = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
			user['cookie_autologin'] = token     
			self.db.update('user', {'cookie_login': token}, 'id', user['id'])
		return user
	def inscription(self, email, password, captcha_code):
		user = self.db.get_one('user', 'email', email)
		if user:
			return {'error_inscription': 'already_exist'}
		if not self.check_captcha(captcha_code):
			return {'error_inscription': 'wrong_captcha'}
		code_activation = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
		self.db.insert('user', {
			'email': email,
			'hash': generate_password_hash(password),
			'code_activation': code_activation
		})
		url = self.config['site_name'] + '/api/activation'
		url += '?code=' + code_activation
		email_content = render_template('python_app/activation.html', {'url': url})
		msg = Message(
			subject="Activation: " + self.config['site_name'],
			html=email_content, 
			sender="contact@" + self.config['site_name'], 
			recipients=[email])
		mail = Mail(self.app)
		mail.send(msg)
		return {'res': 'ok'}
	def check_captcha(self, code):
		url = 'https://www.google.com/recaptcha/api/siteverify'
		url += '?secret=' + self.config['captcha_private_key']
		url += '&response=' + code
		res = requests.get(url).content
		if res:
			res_json = json.loads(res)
			return res_json['success']
		return False
	def logout(self):
		pass
		