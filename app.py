from flask import Flask
from utils import render_template
app = Flask(__name__)

@app.route('/')
@app.route('/<page>')
def index(page = ''):
	page = render_template('page1/page1.html', {
		'name': 'Simergie',
		'page': page
	})
	return 'test'

if __name__ == "__main__":
	app.run(host='0.0.0.0', debug=True)