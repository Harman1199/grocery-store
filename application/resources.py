from flask_restful import Resource, Api, reqparse, fields, marshal_with, marshal
from flask_security import auth_required, roles_required, current_user, roles_accepted
from sqlalchemy import or_
from flask import jsonify
from .models import *
from .cache import cache

api = Api(prefix="/api")

prod_parser = reqparse.RequestParser()
prod_parser.add_argument('name', 
						type=str, 
						help="Name is required and should be a string", 
						required=True)
prod_parser.add_argument('unit', 
						type=str, 
						help="Measurement Unit", 
						required=True)
prod_parser.add_argument('rate', 
						type=int, 
						help="Price per unit", 
						required=True)
prod_parser.add_argument('stock', 
						type=int, 
						help="quantity available", 
						required=True)

product_fields = {
					'id': fields.Integer,
					'name': fields.String,
					'unit': fields.String,
					'rate': fields.Integer,
					'stock': fields.Integer,
}


### Category API
cat_parser = reqparse.RequestParser()
cat_parser.add_argument('name', 
						type=str, 
						help="Name is required and should be a string", 
						required=True)
cat_parser.add_argument('is_approved', 
						type=bool)

class Requestor(fields.Raw):
    def format(self, user):
        return user.email

category_fields = {
					'id': fields.Integer,
					'name': fields.String,
					'is_approved': fields.Boolean,
					'request_type': fields.String,
					'requestor': Requestor,
					'products': fields.List(fields.Nested(product_fields)),
					
}

class CategoryAPI(Resource):
	@auth_required("token")
	@cache.cached(timeout=5)
	def get(self):
		#return render_template("./admin/create_category.html")
		if "Admin" in current_user.roles:
			categories = Category.query.all()
		elif "Store Manager" in current_user.roles:
			categories = Category.query.filter(
										or_(Category.is_approved == True, 
											Category.requestor == current_user)).all()
		else:
			categories = Category.query.filter(Category.is_approved == True).all()
		if not categories:
			return {"message": "No category found !"}, 404
		cache.clear()
		return marshal(categories, category_fields)

	@auth_required("token")
	@roles_accepted("Admin", "Store Manager")
	def put(self, category_id):
		args = cat_parser.parse_args()
		user_id = current_user.id
		user = User.query.get(user_id)
		request_type = ''
		cat_name = args.get("name")

		if not cat_name:
			return {"message": "Category name required !"}, 400

		category = Category.query.filter_by(id=category_id).first()
		if category:
			category.name = cat_name
			if "Store Manager" in user.roles:
				category.is_approved = False
				category.request_type = 'Edit'
				category.requestor = current_user
				db.session.commit()
				return {'message': 'Category requested to be updated!'}, 200
			db.session.commit()
			return {'message': 'Category updated successfully'}, 200
		else:
			return {'message': 'Category not found'}, 404

	@auth_required("token")
	@roles_accepted("Admin", "Store Manager")
	def post(self):
		args = cat_parser.parse_args()
		user_id = current_user.id
		user = User.query.get(user_id)
		is_approved = False
		request_type = ''

		if "Admin" in user.roles:
			is_approved = True
		if "Store Manager" in user.roles:
			request_type = 'Include'
		cat_name = args.get("name")
		#request_type = args.get("request_type")
		category_id = db.session.execute(db.select(Category.id).
					where(Category.name == cat_name)).scalar()
		if not cat_name:
			return {"message": "Category name required !"}, 400
		if category_id:
			return {"message": "Category already exists !"}, 400
		category = Category(name=cat_name, 
							is_approved=is_approved,
							request_type=request_type,
							requestor_id=current_user.id)
		db.session.add(category)
		db.session.commit()
		
		return {"message": "Category created !"}

	@auth_required("token")
	@roles_required("Admin")
	def delete(self, category_id):
		user_id = current_user.id
		user = User.query.get(user_id)

		category = Category.query.filter_by(id=category_id).first()
		if category:
			entries = Category_Products.query.filter(Category_Products.category_id == category_id).all()
			for entry in entries:
				db.session.delete(entry)
				db.session.commit()
			products = Product.query.filter(Product.c_id == category_id).all()
			for product in products:
				db.session.delete(product)
				db.session.commit()
			
			db.session.delete(category)
			db.session.commit()
			
			return {'message': 'Category deleted successfully!'}, 200
		else:
			return {'message': 'Sorry, could not find category!'}, 400

class CategoryResource(Resource):
	def get(self, category_id):
		category = Category.query.filter_by(id=category_id).first()
		if category:
			return marshal(category, category_fields)
		else:
			return {'message': 'Category not found'}, 400

	@auth_required("token")
	@roles_required("Store Manager")
	def post(self, category_id):
		category = Category.query.get(category_id)
		if not category:
			return {"message": "Category Not found"}, 400
		category.is_approved = False
		category.request_type = 'Remove'
		category.requestor = current_user
		db.session.commit()
		
		return {"message": "Category requested to be removed!"}, 200

### Product API

class ProductAPI(Resource):
	@auth_required("token")
	def get(self, category_id):
		products = Product.query.filter(Product.c_id == category_id).all()
		return marshal(products, product_fields)

	@auth_required("token")
	@roles_required("Store Manager")
	def post(self, category_id):
		args = prod_parser.parse_args()
		name = args.get("name")
		rate = args.get("rate")
		unit = args.get("unit")
		stock = args.get("stock")

		if not name:
			return {"message": "Name required!"}, 400
		else:
			category = Category.query.filter_by(name=name).first()
			if category:
				return {"message": "Product name clashes with existing Category name!"}, 400
			
			else:
				prod = Product.query.filter_by(name=name).first()
				if prod:
					return {"message": "Product already exists!"}, 400
				else:
					if not rate:
						return {"message": "Rate required!"}, 400
					elif rate <= 0:
						return {"message": "Rate must be greater than 0!"}, 400
					elif not unit:
						return {"message": "Unit required!"}, 400
					elif not stock:
						return {"message": "Stock required!"}, 400
					elif stock < 1:
						return {"message": "Stock value must be at least 1!"}, 400
					else:
						product = Product(c_id=category_id, 
										  name=name, rate=rate, 
										  unit=unit, stock=stock)
						db.session.add(product)
						db.session.commit()

						## Entry in Cat_Prod
						product_id = db.session.execute(db.select(Product.id).where(Product.name == name)).scalar()
						entry = Category_Products(category_id=category_id, product_id=product_id)
						db.session.add(entry)
						db.session.commit()
						return {"message": "Product created !"}, 200

	@auth_required("token")
	@roles_required("Store Manager")
	def delete(self, category_id, product_id):
		product = Product.query.filter_by(id=product_id).first()
		if product:
			entries = Category_Products.query.filter(Category_Products.product_id == product_id).all()
			for entry in entries:
				db.session.delete(entry)
				db.session.commit()
				
			db.session.delete(product)
			db.session.commit()
			return {'message': 'Product deleted successfully!'}, 200
		else:
				return {'message': 'Product not found!'}, 400

class ProductResource(Resource):
	@auth_required("token")
	def get(self, product_id):
		product = Product.query.filter_by(id=product_id).first()
		if product:
			return marshal(product, product_fields)
		else:
			return {'message': 'Product not found'}, 400

	@auth_required("token")
	@roles_required("Store Manager")
	def put(self, product_id):
		args = prod_parser.parse_args()
		rate = args.get("rate")
		unit = args.get("unit")
		stock = args.get("stock")
		if rate <= 0:
			return {"message": "Rate must be greater than 0!"}, 400
		elif stock < 1:
			return {"message": "Stock value must be at least 1!"}, 400
		else:
			product = Product.query.filter_by(id=product_id).first()
			if product:
				product.rate = rate
				product.unit = unit
				product.stock = stock
				db.session.commit()
				return {'message': 'Product updated successfully'}, 200
			else:
				return {'message': 'Product not found!'}, 400

### ADDING API RESOURCES
api.add_resource(CategoryAPI, "/category", "/category/<int:category_id>")
api.add_resource(ProductAPI, "/category/<int:category_id>/product", 
							 "/category/<int:category_id>/product/<int:product_id>")

api.add_resource(CategoryResource, "/category/<int:category_id>/access", "/category/<int:category_id>/delete") # To GET single category

api.add_resource(ProductResource, "/product/<int:product_id>") # To GET or PUT single product
