from flask import Flask, json, request
import os

from utils import render_template, render_page
from python_app.Loader import Loader
from python_app.User import User

app = Flask(__name__)

ROOT_PATH_APP = os.path.dirname(os.path.abspath(__file__)) + '/'

def action(name):
	return name == request.args.get('action')

@app.route('/')
@app.route('/<page>')
def index(page = ''):
	with open('config.json') as f: config = json.load(f)
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

@app.route('/api/login', methods=['POST'])
def api_login():
	if action('signin_new_user'):
		return json.dumps({'res': 'OOOK'})
	return json.dumps({'res': 'ok'})

if __name__ == "__main__":
	app.run(host='0.0.0.0', debug=True)