import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
	DEBUG = False
	SQLITE_DB_DIR = None
	SQLALCHEMY_DATABASE_URI = None
	
class LocalDevelopmentConfig(Config):
	SQLITE_DB_DIR = os.path.join(basedir, "../db_directory")
	SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "database.sqlite3")
	SECRET_KEY = "secretkey"
	SECURITY_PASSWORD_SALT = "saltandsugar"
	SQLALCHEMY_TRACK_MODIFICATIONS = False

	CACHE_TYPE = "RedisCache"
	CACHE_REDIS_HOST = "localhost"
	CACHE_REDIS_PORT = 6379
	CACHE_REDIS_DB = 3

	SECURITY_LOGIN_URL = '/'
	SECURITY_LOGIN_USER_TEMPLATE = 'index.html'


	WTF_CSRF_ENABLED = False
	SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
	DEBUG = True