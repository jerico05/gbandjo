"""Enregistrement des blueprints REST et Swagger."""
from flask import Flask

from app.errors.error_handlers import ErrorHandlers
from app.extensions import api
from app.middleware.auth_middleware import auth_middleware
from app.routes.admin.admin_category_routes import admin_categories_blp
from app.routes.admin.admin_dashboard_routes import admin_dashboard_blp
from app.routes.admin.admin_offer_routes import admin_offers_blp
from app.routes.admin.admin_store_routes import admin_stores_blp
from app.routes.admin.admin_user_routes import admin_users_blp
from app.routes.auth_routes import auth_blp
from app.routes.consumer.consumer_reservation_routes import consumer_reservations_blp
from app.routes.internal_routes import internal_blp
from app.routes.category_routes import categories_blp
from app.routes.merchant.merchant_offer_routes import merchant_offers_blp
from app.routes.merchant.merchant_product_routes import merchant_products_blp
from app.routes.merchant.merchant_reservation_routes import merchant_reservations_blp
from app.routes.notification_routes import notifications_blp
from app.routes.offer_routes import offers_blp
from app.routes.store_routes import stores_blp
from app.routes.system_routes import system_blp
from app.routes.user_routes import users_blp


def initialize_api(application: Flask) -> None:
    api.init_app(application)
    auth_middleware.init_app(application)
    ErrorHandlers.register(application)
    api.register_blueprint(system_blp)
    api.register_blueprint(auth_blp)
    api.register_blueprint(users_blp)
    api.register_blueprint(stores_blp)
    api.register_blueprint(admin_stores_blp)
    api.register_blueprint(admin_users_blp)
    api.register_blueprint(admin_offers_blp)
    api.register_blueprint(admin_dashboard_blp)
    api.register_blueprint(admin_categories_blp)
    api.register_blueprint(categories_blp)
    api.register_blueprint(offers_blp)
    api.register_blueprint(merchant_products_blp)
    api.register_blueprint(merchant_offers_blp)
    api.register_blueprint(consumer_reservations_blp)
    api.register_blueprint(merchant_reservations_blp)
    api.register_blueprint(internal_blp)
    api.register_blueprint(notifications_blp)
