import os
import glob
class Loader():
	def __init__(self, root):
		self.root = root
		self.files = []
	def get_ressources(self):
		ressources = {'html': []}
		for file in self.files:
			ressources[file['type']].append(file)
		return ressources
	def include_folders(self, folders):
		for folder in folders:
			self.include_files(self.root + folder)
	def include_files(self, file):
		if os.path.isdir(file):
			for sub in glob.iglob(file + '/*', recursive=True):
				self.include_files(sub)
		else:
			file = file.split(self.root)[1]
			if file.endswith('.html'):
				with open(self.root + file, 'r') as f: content = f.read()
				self.files.append({
					'type': 'html',
					'content': content
				})
			