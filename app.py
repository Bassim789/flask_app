from flask import Flask
from utils import render_template
app = Flask(__name__)

@app.route('/')
@app.route('/<page>')
def index(page = ''):
	page_wrap = render_template('public/wrap/page_wrap/page_wrap.html', {
		'name': 'Simergie',
		'page': page,
		'page_from_backend': 'new app'
	})
	return page_wrap

if __name__ == "__main__":
	app.run(host='0.0.0.0', debug=True)