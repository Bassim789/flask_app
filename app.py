from flask import Flask, json, request, make_response, redirect
import os
from utils import *
from python_app.Loader import Loader
from python_app.User import User
from python_app.Db import Db
from python_app.Login import Login

app = Flask(__name__)
app.secret_key = 'fdiu98dfds0af3nwiweee'
ROOT_PATH_APP = os.path.dirname(os.path.abspath(__file__)) + '/'

with open('config.json') as f: config = json.load(f)
db = Db({
	'db_host': config['db_mysql_db_host'],
	'db_user': config['db_mysql_db_user'], 
	'db_pass': config['db_mysql_db_password'], 
	'db_name': config['db_mysql_db_name']
})
login = Login(db, config, app)

@app.route('/')
@app.route('/<page>')
def index(page = ''):
	loader = Loader(ROOT_PATH_APP)
	loader.include_folders([
		'app/app',
		'public',
	])
	user = User()
	page_data = {}
	if not page or page == '':
		page = 'index'
	page_from_backend = render_page(page, {})
	ressources = loader.get_ressources()
	page_wrap = render_template('page_container.html', {
		'page_from_backend': page_from_backend,
		'ressources': ressources,
		'gvar': {
			'page_data': json.dumps(page_data),
			'watcher': 'true' if config['watcher'] else 'false',
			'user_is_logged': 'true' if user.is_logged else 'false',
			'user_session_hash': user.session_hash,
			'user_is_admin': 'true' if user.is_admin else 'false',
			'user_email': user.email,
			'captcha_site_key': config['captcha_site_key'],
		}
	})
	return page_wrap

@app.route('/api/login', methods=['GET', 'POST'])
def api_login():

	if action('signin_new_user'):
		res = login.inscription(
			request.form['email'], 
			request.form['password'],
			request.form['captcha'])
		if is_error(res): return send_error(res)
		return send_ok()

	if action('connexion'):
		form = request.form
		user = login.connexion(form['email'], form['password'], form['remember'])
		if is_error(user): return send_error(user)
		resp = make_response(send_ok())
		if form['remember'] == 'on':
			resp.set_cookie('autologin', user['cookie_autologin'])
		return resp

	if action('logout'):
		login.logout()
		return send_ok()

	if action('activation'):
		res = login.activate_account(request.args.get('code'))
		if not res: return 'error account activation'
		url = config['http_mode'] + '://' + config['site_name']
		return redirect(url, code=302)

	return send({'res': 'api/login: no action found'})

if __name__ == "__main__":
	app.run(host='0.0.0.0', debug=True)