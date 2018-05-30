import pystache
def render_template(template, data = {}):
	with open(template) as file:
		return pystache.render(file.read(), data)