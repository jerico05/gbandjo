"""Synchronise les catégories catalogue avec la liste métier officielle."""
from __future__ import annotations

import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from sqlalchemy import select, update

from app import create_app
from app.extensions import db
from app.models import Category, Product
from app.services.category_service import CategoryService

DEFAULT_CATEGORY_NAMES = (
    "Produits laitiers",
    "Boissons et jus",
    "Fruits et légumes",
    "Boulangerie et pâtisserie",
    "Viandes et volailles",
    "Poissons et fruits de mer",
    "Épicerie et produits alimentaires",
    "Biscuits et confiseries",
)

# Anciens libellés → nouveaux (conserve les IDs et les produits liés)
CATEGORY_RENAMES = {
    "Boulangerie": "Boulangerie et pâtisserie",
    "Épicerie": "Épicerie et produits alimentaires",
    "Fruits & légumes": "Fruits et légumes",
    "Fruits": "Fruits et légumes",
    "Boissons": "Boissons et jus",
}


def _reassign_products(from_category_id: int, to_category_id: int) -> None:
    """Réaffecte les produits via UPDATE SQL (évite le NULL ORM à la suppression)."""
    if from_category_id == to_category_id:
        return
    db.session.execute(
        update(Product)
        .where(Product.category_id == from_category_id)
        .values(category_id=to_category_id)
    )
    db.session.expire_all()


def seed_categories() -> int:
    app = create_app()
    with app.app_context():
        categories = list(db.session.scalars(select(Category)))
        by_name = {c.name: c for c in categories}
        created = 0
        renamed = 0
        removed = 0

        for name in DEFAULT_CATEGORY_NAMES:
            if name not in by_name:
                category = Category(name=name)
                db.session.add(category)
                db.session.flush()
                by_name[name] = category
                created += 1

        for old_name, new_name in CATEGORY_RENAMES.items():
            source = by_name.get(old_name)
            if source is None or old_name == new_name:
                continue
            target = by_name.get(new_name)
            if target is not None:
                _reassign_products(source.id, target.id)
                db.session.delete(source)
                db.session.flush()
                by_name.pop(old_name, None)
                removed += 1
            else:
                source.name = new_name
                db.session.flush()
                by_name.pop(old_name, None)
                by_name[new_name] = source
                renamed += 1

        fallback = by_name["Épicerie et produits alimentaires"]
        wanted = set(DEFAULT_CATEGORY_NAMES)
        for category in list(by_name.values()):
            if category.name in wanted:
                continue
            _reassign_products(category.id, fallback.id)
            db.session.delete(category)
            db.session.flush()
            by_name.pop(category.name, None)
            removed += 1

        db.session.commit()
        CategoryService.invalidate_public_cache()
        print(
            f"Catégories synchronisées — créées: {created}, renommées: {renamed}, "
            f"retirées: {removed}, total: {len(DEFAULT_CATEGORY_NAMES)}."
        )
        return len(DEFAULT_CATEGORY_NAMES)


if __name__ == "__main__":
    seed_categories()
