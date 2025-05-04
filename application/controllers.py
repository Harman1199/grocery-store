from flask import jsonify, send_file
from flask import Flask, request, redirect, url_for
from flask import render_template
from flask import current_app as app
from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from application.models import *
from .datastore import datastore
from .tasks import products_csv
from celery.result import AsyncResult
from datetime import datetime

@app.get('/csv')
def download_csv():
	t = products_csv.delay()
	return jsonify({"Task ID": t.id})

@app.get('/csv/access/<t_id>')
def access_csv(t_id):
	result = AsyncResult(t_id)
	if result.ready():
		filename = result.result
		return send_file(filename, as_attachment=True)
	return jsonify({"message": "Pending Task !"}), 400

# ************************************************************** #
@app.route("/welcome", methods=['GET', 'POST'])
def welcome():
	return render_template("welcome.html")

@app.route("/", methods=['GET', 'POST'])
def home():
	#return render_template("./rest/home.html")
	return render_template("index.html")

## RETURN LIST OF MANAGERS TO ACTIVATE THEIR ACCOUNTS
user_fields = {
	"id": fields.Integer,
	"username": fields.String,
	"email": fields.String,
	"active": fields.Boolean
}

@app.get('/admin/user')
@auth_required("token")
@roles_required('Admin')
def userlist():
	users = User.query.all()
	if not len(users):
		return jsonify({"message": "No User found!"}), 404
	return marshal(users, user_fields)

# ************************************ #

### ACTIVATE A USER
@app.get("/admin/user/activate_user/<int:user_id>")
@auth_required("token")
@roles_required('Admin')
def activate_user(user_id):
	user = User.query.get(user_id)
	if not user:
		return jsonify({"message": "User not found!"}), 404
	if "Store Manager" not in user.roles:
		return jsonify({"message": "User not allowed!"}), 404
	user.active = True
	db.session.commit()
	return jsonify({"message": "User activated!"})
# ********************* #

### APPROVE A CATEGORY REQUEST
@app.get('/category/<int:id>/activate')
@auth_required("token")
@roles_required('Admin')
def approve_request(id):
	category = Category.query.get(id)
	if not category:
		return jsonify({"message": "Category Not found"}), 404
	if category.request_type in ['Include', 'Edit']:
		category.is_approved = True
		db.session.commit()
	if category.request_type == 'Remove':
		db.session.delete(category)
		db.session.commit()
	
	return jsonify({"message": "Request approved!"})
# ********************* #


### USER #############################################################################

### USER REGISTER
@app.post('/user/register')
def register():
	data = request.get_json()
	email = data.get('email')
	password = data.get("password")
	role = data.get("role")
	active = True
	if role == 'Store Manager':
		active = False

	if not email:
		return jsonify({"message": "Email not provided!"}), 400
	if not password:
			return jsonify({"message": "Password not provided!"}), 400
	user = datastore.find_user(email=email)
	if user:
		return jsonify({"message": "User with this email already exists!"}), 400
	
	else:
		datastore.create_user(email=email,
							  password=generate_password_hash(password),
							  roles=[role], active=active)
		db.session.commit()
		return jsonify({"message": "User created successfully!"}), 200

	
# ********************* #

### USER LOGIN
@app.post('/user/login')
def login_user():
	data = request.get_json()
	email = data.get('email')
	if not email:
		return jsonify({"message": "Email not provided"}), 400
	user = datastore.find_user(email=email)
	if not user:
		return jsonify({"message": "User not found"}), 404
	if "Store Manager" in user.roles[0].name:
		if not user.active:
			return jsonify({"message": "Manager not yet approved by admin!"}), 400
	if check_password_hash(user.password, data.get("password")):
		user.last_login_time = datetime.now()
		db.session.commit()
		return jsonify({"token": user.get_auth_token(),
				 		"email": user.email,
				 		"role": user.roles[0].name})
	else:
		return jsonify({"message": "wrong password"}), 400

# ********************* #

@app.post('/<string:email>/<int:product_id>/buy')
@auth_required("token")
@roles_required('User')
def add_to_cart(email, product_id):
	user = User.query.filter_by(email=email).first()
	product = Product.query.filter_by(id=product_id).first()
	total = 0
	stock = product.stock
	if stock:
		data = request.get_json()
		quantity = int(data)
		if quantity < 1:
			return jsonify({"message": "Please type qunatity at least 1!"}), 400
		elif quantity > stock:
			return jsonify({"message": "Sorry, you can't buy more than what's available!"}), 400
		else:
			product.stock = product.stock - quantity
			db.session.commit()

			total = int(product.rate * quantity)
			order = User_Products(user=email, p_id=product_id, 
								product_name=product.name, 
								quantity=quantity, unit=product.unit, 
								rate=product.rate, total=total)
			db.session.add(order)
			db.session.commit()

			return jsonify({"message": "Item added to cart!"}), 200
	else:
		return jsonify({"message": "Sorry, item is out of stock!"}), 400

@app.get("/order/<int:o_id>/delete")
@auth_required("token")
@roles_required('User')
def delete_order(o_id):
	order = User_Products.query.filter(User_Products.id == o_id).first()
	product = Product.query.filter_by(id=order.p_id).first()
	product.stock = product.stock + order.quantity
	db.session.commit()
	db.session.delete(order)
	db.session.commit()
	return jsonify({"message": "Item removed from cart"}), 200


@app.get('/<string:email>/cart')
@auth_required("token")
@roles_required('User')
def cart(email):
	orders = User_Products.query.filter(User_Products.user == email).all()
	orders_list = []
	columns = ['id', 'user', 'p_id', 'product_name', 
				'quantity', 'unit', 'rate', 'total', 'delivered', 'sent']
	for order in orders:
		order_dict ={}
		for column in columns:
			order_dict[column] = getattr(order, column)
		orders_list.append(order_dict)

	transaction_total = 0
	for order in orders:
		if not order.delivered:
			transaction_total = transaction_total + order.total
	return jsonify({"orders": orders_list,
					"transaction_total": transaction_total})

@app.get("/<string:email>/checkout")
@auth_required("token")
@roles_required('User')
def checkout(email):
	orders = User_Products.query.filter(User_Products.user == email).all()
	if orders:
		for order in orders:
			order.delivered = True
			db.session.commit()
		user = User.query.filter_by(email=email).first()
		if user:
			user.last_purchase_time = datetime.now()
			db.session.commit()
		return jsonify({"message": "Items on your way !"})
	return jsonify({"message": "Something went wrong!"}), 400


@app.get("/search/<string:q>")
@auth_required("token")
def search(q):
	query = "%"+q+"%"
	## Serializing categories
	categories = Category.query.filter(Category.name.ilike(query)).all()
	c_list = []
	c_columns = ['id', 'name', 'is_approved']
	for category in categories:
		c_dict ={}
		for column in c_columns:
			c_dict[column] = getattr(category, column)
		## Serializing category.products
		products = getattr(category, 'products')
		p_list = []
		p_columns = ['id', 'c_id', 'name', 'rate', 'unit']
		for product in products:
			p_dict ={}
			for column in p_columns:
				p_dict[column] = getattr(product, column)
			p_list.append(p_dict)
		c_dict['products'] = p_list
		c_list.append(c_dict)

	## Serializing products
	products = Product.query.filter(Product.name.ilike(query)).all()
	p_list = []
	p_columns = ['id', 'c_id', 'name', 'rate', 'unit']
	for product in products:
		p_dict ={}
		for column in p_columns:
			p_dict[column] = getattr(product, column)
		p_list.append(p_dict)

	if c_list:
		return jsonify({"categories": c_list, "products": p_list})
	elif (not c_list) and (p_list):
		return jsonify({"categories": [], "products": p_list})
	elif (not c_list) and (not p_list):
		try:
			query = int(q)
			products = Product.query.filter(Product.rate.like(query)).all()
			p_list = []
			p_columns = ['id', 'c_id', 'name', 'rate', 'unit']
			for product in products:
				p_dict ={}
				for column in p_columns:
					p_dict[column] = getattr(product, column)
				p_list.append(p_dict)
			if p_list:
				return jsonify({"categories": [], "products": p_list})
		except:
			return jsonify({"categories": [], "products": []})
	return jsonify({"categories": [], "products": []})
