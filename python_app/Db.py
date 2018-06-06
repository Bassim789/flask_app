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

	def get_one(self, table, where, where_value):
		self.db.execute(
			'SELECT * FROM {table} WHERE {where} = "{where_value}"'.format(
				table = table,
				where = where,
				where_value = where_value
			)
		)
		return self.db.fetchone()

	def get_all(self, table):
		self.db.execute("SELECT * FROM {table}".format(table = table))
		return self.db.fetchall()

	def delete(self, table, where, where_value):
		self.db.execute(
			'DELETE FROM {table} WHERE {where} = "{where_value}"'.format(
				table = table,
				where = where,
				where_value = where_value
			)
		)
	def delete_all(self, table):
		self.db.execute('DELETE FROM {table}'.format(table = table))

	def update(self, table, where, where_value):
		self.db.execute("UPDATE {table} SET  WHERE {where} = '{where_value}'".format(table = table))
