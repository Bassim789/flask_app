from werkzeug.security import generate_password_hash, check_password_hash

class Login():
	def __init__(self, db):
		self.db = db
	def connexion(self, email, password, remember):
		user = self.db.get_one('user', 'email', email)
		if not user: 
			return {'error_connexion': 'email not found'}
		if not check_password_hash(user['hash'], password):
			return {'error_connexion': 'wrong password'}
		if remember == 'on':
			pass
			#cookiehash = "cookie".md5(sha1($user['id'].$email.$user['hash']));
			#setcookie("uname", $cookiehash, time() + 3600 * 24 * 365);
			#$data['cookieLogin'] = $cookiehash;      
			#self.db.update('user', 'email', email)
		return user
