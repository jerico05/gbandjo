"""Fabrique de l'application Flask Gbandjo."""
import os

from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db, migrate
from app.routes import initialize_api


def _validate_required_settings(app: Flask) -> None:
    if app.config.get("TESTING"):
        return
    if not app.config.get("SECRET_KEY"):
        raise RuntimeError("SECRET_KEY est obligatoire (.env).")
    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        raise RuntimeError("DATABASE_URL est obligatoire (.env).")


def create_app(config_class: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)
    _validate_required_settings(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    db.init_app(app)
    from app import models  # noqa: F401

    racine = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    migrate.init_app(app, db, directory=os.path.join(racine, "migrations"))

    initialize_api(app)

    return app
