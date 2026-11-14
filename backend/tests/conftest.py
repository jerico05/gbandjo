"""Fixtures de test : une base PostgreSQL réelle, jamais la base de développement.

Si TEST_DATABASE_URL n'est pas définie, un serveur PostgreSQL temporaire est
lancé avec le paquet `pgserver` (voir requirements-dev.txt).
"""
import os

import pytest

from app import create_app
from app.config import TestConfig, normaliser_url_base
from app.extensions import db


@pytest.fixture(scope="session")
def url_base_test(tmp_path_factory):
    url = os.getenv("TEST_DATABASE_URL")
    if url:
        if url == os.getenv("DATABASE_URL"):
            pytest.exit("TEST_DATABASE_URL ne doit pas être la base de développement.")
        yield normaliser_url_base(url)
        return
    import pgserver

    serveur = pgserver.get_server(tmp_path_factory.mktemp("pgdata"), cleanup_mode="delete")
    serveur.psql("CREATE DATABASE gbandjo_test;")
    yield normaliser_url_base(serveur.get_uri("gbandjo_test"))
    serveur.cleanup()


def _vider_base():
    """Supprime toutes les tables, y compris le suivi des migrations."""
    db.session.remove()
    db.drop_all()
    db.session.execute(db.text("DROP TABLE IF EXISTS alembic_version"))
    db.session.commit()


@pytest.fixture()
def app_sans_schema(url_base_test):
    class Config(TestConfig):
        SQLALCHEMY_DATABASE_URI = url_base_test

    app = create_app(Config)
    with app.app_context():
        _vider_base()
        yield app
        _vider_base()


@pytest.fixture()
def app(app_sans_schema):
    db.create_all()
    return app_sans_schema


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def session(app):
    return db.session
