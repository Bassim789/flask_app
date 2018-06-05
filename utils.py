import pystache
import os.path
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