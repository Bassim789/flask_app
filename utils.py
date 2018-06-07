import pystache
import os.path
from flask import json, request
def render_template(template, data = {}):
	with open(template) as file:
		return pystache.render(file.read(), data)
def render_page(name, data = {}):
	path = 'public/page/' + name + '/' + name + '.html'
	if not os.path.isfile(path):
		return 'La page demandée n\'existe pas.'
	with open(path) as file:
		beging = '<template page="' + name + '">'
		end = '</template>'
		div_content = file.read().split(beging)[1].split(end)[0]
		return pystache.render(div_content, data)
def action(name):
	return name == request.args.get('action')
def send(data):
	return json.dumps(data)
def send_ok():
	return send({'res': 'ok'})
def send_error(error):
	return send({'res': 'error', 'error': str(error['error'])})
def is_error(data):
	if not data or ('error' in data and len(data) == 1):
		return True
	return False