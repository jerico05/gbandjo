"""Insère les catégories catalogue par défaut si la table est vide."""
from __future__ import annotations

import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import func, select

from app import create_app
from app.extensions import db
from app.models import Category
from app.services.category_service import CategoryService

DEFAULT_CATEGORY_NAMES = (
    "Boulangerie",
    "Épicerie",
    "Restaurant",
    "Fruits & légumes",
    "Cosmétiques",
    "Maison",
)


def seed_categories() -> int:
    app = create_app()
    with app.app_context():
        existing = db.session.scalar(select(func.count()).select_from(Category)) or 0
        if existing > 0:
            print(f"Déjà {existing} catégorie(s) en base — rien à faire.")
            return 0
        for name in DEFAULT_CATEGORY_NAMES:
            db.session.add(Category(name=name))
        db.session.commit()
        CategoryService.invalidate_public_cache()
        print(f"{len(DEFAULT_CATEGORY_NAMES)} catégories créées.")
        return len(DEFAULT_CATEGORY_NAMES)


if __name__ == "__main__":
    seed_categories()