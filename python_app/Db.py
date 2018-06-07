import MySQLdb, MySQLdb.cursors
class Db():
	def __init__(self, data):
		try:
			con = MySQLdb.connect(
				data['db_host'], data['db_user'], data['db_pass'], data['db_name'],
				cursorclass = MySQLdb.cursors.DictCursor
			)
			con.autocommit(True)
			db = con.cursor()
			db.execute("SET NAMES utf8mb4;")
			db.execute("SET CHARACTER SET utf8mb4;")
			db.execute("SET character_set_connection=utf8mb4;")
			self.db = db
		except Exception as ex:
			print('connect_db error:' + str(ex))

	def param(self, name):
		return '%(' + name + ')s'

	def insert(self, table, data):
		cols = ''
		values = ''
		for key in data.keys():
			cols += key + ', '
			values += self.param(key) + ', '
		cols = cols.strip(', ')
		values = values.strip(', ')
		query = "INSERT INTO " + table + "(" + cols + ") VALUES(" + values + ")"
		self.db.execute(query, data)
		return self.get_last_id()
	def update(self, table, data, where, where_value = ''):
		set_values = ''
		for key, value in data.items():
			set_values += key + ' = ' + self.param(key) + ', '
		set_values = set_values.strip(', ')
		query = 'UPDATE ' + table + ' SET ' + set_values + ' WHERE ' + where + ' = ' + self.param(where)
		data[where] = where_value
		self.db.execute(query, data)

	def query_all(self, query, param = {}):
		self.db.execute(query, param)
		rows = self.db.fetchall()
		if rows == None: return False
		else: return rows

	def query_one(self, query, params):
		self.db.execute(query, params)
		row = self.db.fetchone()
		if row == None: return False
		else: return row

	def get_one(self, table, colname, value):
		sql = f"SELECT * FROM {table} WHERE {colname} = {self.param('value')}"
		return self.query_one(sql, {'value': value})

	def get_last_id(self):
		return self.db.lastrowid
