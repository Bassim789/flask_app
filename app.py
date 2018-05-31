from flask import Flask, json
import os

from utils import render_template
from python_app.Loader import Loader
from python_app.User import User

app = Flask(__name__)

ROOT_PATH_APP = os.path.dirname(os.path.abspath(__file__)) + '/'

@app.route('/')
@app.route('/<page>')
def index(page = ''):
	with open('config.json') as f: config = json.load(f)
	loader = Loader(ROOT_PATH_APP, config['compiled'], config['folder_compiled'])
	loader.include_folders([
		'app/app',
		'public',
	])
	user = User()
	page_data = {}
	page_from_backend = '<h1 class="main_title">New app</h1>'
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
		}
	})
	return page_wrap

if __name__ == "__main__":
	app.run(host='0.0.0.0', debug=True)