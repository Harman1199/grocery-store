import os
from flask import Flask
from application import config
from application.config import LocalDevelopmentConfig
from application.database import db
from application.models import User, Role
from application.resources import api
from application.datastore import datastore
from flask_security import SQLAlchemyUserDatastore, Security
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import monthly_report, daily_reminder
from application.cache import cache

app = None

def create_app():
	app = Flask(__name__, template_folder="templates")
	app.config.from_object(LocalDevelopmentConfig)
	app.jinja_options = app.jinja_options.copy()
	app.jinja_options['variable_start_string'] = '[[ '
	app.jinja_options['variable_end_string'] = ' ]]'
	db.init_app(app)
	api.init_app(app)
	excel.init_excel(app)
	app.security = Security(app, datastore)
	cache.init_app(app)
	app.app_context().push()
	with app.app_context():
		import application.controllers
	return app

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=9, minute=0, day_of_month='1'), #day_of_month=1
        monthly_report.s('system@email.com', 'Monthly Activity Report'),
    )

@celery_app.on_after_configure.connect
def daily_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=17, minute=0),
        daily_reminder.s('system@email.com', 'Your daily reminder :)'),
    )


if __name__ == '__main__':
	app.run(port=8000)