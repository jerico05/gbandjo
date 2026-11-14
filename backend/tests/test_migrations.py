"""Vérifie que les migrations Alembic produisent exactement le schéma des modèles."""
from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext
from flask_migrate import downgrade, upgrade
from sqlalchemy import inspect

from app.extensions import db


def test_migrations_alignees_sur_les_modeles(app_sans_schema):
    upgrade()
    with db.engine.connect() as connexion:
        contexte = MigrationContext.configure(connexion)
        differences = compare_metadata(contexte, db.metadata)
    assert differences == [], f"Le schéma migré diffère des modèles : {differences}"


def test_retour_arriere_supprime_toutes_les_tables(app_sans_schema):
    upgrade()
    assert "reservation" in inspect(db.engine).get_table_names()
    downgrade(revision="base")
    assert set(inspect(db.engine).get_table_names()) <= {"alembic_version"}
