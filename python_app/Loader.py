import os
import glob
class Loader():
	def __init__(self, root, compiled, folder_compiled):
		self.compiled = compiled
		self.folder_compiled = folder_compiled
		self.root = root
		self.files = []
	def get_ressources(self):
		ressources = {'css': [], 'js': [], 'html': []}
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
			if file.endswith('.js'): pass
				# if self.compiled:
				# 	file = self.folder_compiled + '/' + file
				# self.files.append({
				# 	'type': 'js',
				# 	'url': file,
				# 	'timestamp': os.path.getmtime(self.root + file)
				# })
			# elif file.endswith('.styl'):
			# 	file = self.folder_compiled + '/' + file.replace('.styl', '.css')
			# 	if os.path.isfile(self.root + file):
			# 		self.files.append({
			# 			'type': 'css',
			# 			'url': file,
			# 			'timestamp': os.path.getmtime(self.root + file)
			# 		})
			elif file.endswith('.html'):
				with open(self.root + file, 'r') as f: content = f.read()
				self.files.append({
					'type': 'html',
					'content': content
				})
			