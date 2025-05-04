from .database import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime


class User(db.Model, UserMixin):
	__tablename__ = 'users'
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String, unique=False)
	email = db.Column(db.String, unique=True)
	password = db.Column(db.String(255))
	active = db.Column(db.Boolean())
	fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
	roles = db.relationship('Role', secondary='roles_users',
		backref=db.backref('users', lazy='dynamic'))
	request = db.relationship('Category', backref='requestor')

	last_login_time = db.Column(db.DateTime, default=datetime.now)
	last_purchase_time = db.Column(db.DateTime, default=datetime.now)


class Role(db.Model, RoleMixin):
	__tablename__ = 'roles'
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String, unique=True)
	description = db.Column(db.String(255))

class RolesUser(db.Model):
	__tablename__ = 'roles_users'
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
	role_id = db.Column('role_id', db.Integer, db.ForeignKey('roles.id'))

class Category(db.Model):
	__tablename__ = 'categories'
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String, unique=True, nullable=False)
	is_approved = db.Column(db.Boolean(), default=False)
	requestor_id = db.Column('requestor_id', db.Integer, db.ForeignKey('users.id'))
	request_type = db.Column(db.String)
	# products = db.relationship('Product', secondary='category_products',
	# 	backref=db.backref('categories', lazy='dynamic'))
	products = db.relationship("Product", secondary="category_products", cascade="all, delete")
	

class Product(db.Model):
	__tablename__ = 'products'
	id = db.Column(db.Integer, primary_key=True)
	c_id = db.Column(db.Integer, db.ForeignKey("categories.id", ondelete="CASCADE"))
	name = db.Column(db.String, unique=True, nullable=False)
	rate = db.Column(db.Integer, nullable=False)
	unit = db.Column(db.String, nullable=False)
	stock = db.Column(db.Integer, nullable=False)

class Category_Products(db.Model):
	__tablename__ = 'category_products'
	id = db.Column(db.Integer, primary_key=True)
	category_id = db.Column('category_id', db.Integer, db.ForeignKey("categories.id"))
	product_id = db.Column('product_id', db.Integer, db.ForeignKey("products.id"))


class User_Products(db.Model):
	__tablename__ = 'user_products'
	id = db.Column(db.Integer, primary_key=True)
	user = db.Column(db.String, db.ForeignKey("users.email"))
	p_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"))
	product_name = db.Column(db.String, db.ForeignKey("products.name", ondelete="CASCADE"))
	quantity = db.Column(db.Integer, nullable=False)
	unit = db.Column(db.String, db.ForeignKey("products.unit", ondelete="CASCADE"))
	rate = db.Column(db.Integer, db.ForeignKey("products.rate", ondelete="CASCADE"))
	total = db.Column(db.Integer, nullable=False)
	delivered = db.Column(db.Boolean(), default=False)
	sent = db.Column(db.Boolean(), default=False)

