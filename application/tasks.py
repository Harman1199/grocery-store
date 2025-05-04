import os
from celery import shared_task
import flask_excel as excel
from application.models import Product
from .mail_service import send_message
from jinja2 import Template
from sqlalchemy import and_, func
from .models import *
from datetime import datetime, timedelta

@shared_task(ignore_result=False)
def products_csv():
	products = db.session.query(Product.name, Product.rate,
								Product.unit, Product.stock,
								func.sum(User_Products.quantity).label('sold')
								).join(User_Products, Product.id == User_Products.p_id).group_by(Product.id).all()

	csv = excel.make_response_from_query_sets(products, 
			["name", "rate", "unit", "stock", "sold"], "csv")
	filename="products_stock.csv"
	with open(filename, 'wb') as f:
		f.write(csv.data) # File data will be stored on Server

	return filename # Only Filename will be stored in Redis here

@shared_task(ignore_result=True)
def daily_reminder(to, subject):
	users = User.query.filter(User.roles.any(Role.name == 'User')).all()
	for user in users:
		last_login_time = user.last_login_time
		last_purchase_time = user.last_purchase_time

		if ((datetime.now() - last_login_time) > timedelta(days=1)) or ((datetime.now() - last_purchase_time) > timedelta(days=1)):
			message = '''It's been a while since you visited or bought anything on our website !
			Check out our latest deals and items offered. Thank you.
			'''
			my_dir = os.path.dirname(os.path.abspath(__file__))
			file_path = os.path.join(my_dir, 'daily_rem.html')
			with open(file_path, 'r') as f:
				template = Template(f.read())
				send_message(user.email, subject, template.render(user=user.email,
				message=message))
	return 'Done'

@shared_task(ignore_result=True)
def monthly_report(to, subject):
	users = User.query.filter(User.roles.any(Role.name == 'User')).all()
	emails = User_Products.query.with_entities(User_Products.user).distinct().all()
	emails = [email[0] for email in emails]
	for user in users:
		if user.email in emails:
			orders = User_Products.query.filter(and_(User_Products.user == user.email,
						 User_Products.delivered == True,
						 User_Products.sent == False)).all()
			expenditure = 0
			if orders:
				for order in orders:
					order.sent = True
					db.session.commit()
					expenditure += order.total

				my_dir = os.path.dirname(os.path.abspath(__file__))
				file_path = os.path.join(my_dir, 'monthly_report.html')

				with open(file_path, 'r') as f:
					template = Template(f.read())
					send_message(user.email, subject, template.render(user=user.email,
					orders=orders, expenditure=expenditure))
	return 'Done'