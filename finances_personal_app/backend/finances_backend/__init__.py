import pymysql

# Install PyMySQL as MySQLdb so Django's MySQL backend can import it
pymysql.install_as_MySQLdb()

# Workaround for Django 6+ check expecting mysqlclient >= 2.2.1.
# After install_as_MySQLdb, importing MySQLdb returns the PyMySQL shim.
# We set the version attributes to satisfy Django's backend requirement.
try:
	import MySQLdb  # provided by the PyMySQL shim
	MySQLdb.__version__ = "2.2.1"
	MySQLdb.version_info = (2, 2, 1, 'final', 0)
except Exception:
	# If import fails here, Django will surface the real error later.
	pass