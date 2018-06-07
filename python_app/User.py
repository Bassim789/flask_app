from flask import session
class User():
	def __init__(self):
		self.is_logged = False
		self.is_admin = False
		self.session_hash = False
		self.email = False
		if 'is_logged' in session and session['is_logged']:
			self.is_logged = True
			self.email = session['user_email']