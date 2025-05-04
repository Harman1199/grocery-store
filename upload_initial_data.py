from main import app
from application.datastore import datastore
from application.models import db, Role
# from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
	db.create_all()
	datastore.find_or_create_role(name='Admin', 
		description='There is only one admin: John')
	datastore.find_or_create_role(name='Store Manager', 
		description='User is a store manager')
	datastore.find_or_create_role(name='User', 
		description='Welcome User !')
	db.session.commit()
	if not datastore.find_user(email="jan@admin.com"):
		datastore.create_user(email="jan@admin.com", 
			password=generate_password_hash("jan123"),
			username = "Jan",
			roles=['Admin'])
	if not datastore.find_user(email="michael@user.com"):
		datastore.create_user(email="michael@user.com", 
			password=generate_password_hash("michael123"),
			username = "Michael",
			roles=["Store Manager"], active=False)
	if not datastore.find_user(email="dwight@user.com"):
		datastore.create_user(email="dwight@user.com", 
			password=generate_password_hash("dwight123"),
			username = "Dwight",
			roles=["User"])
	db.session.commit()
