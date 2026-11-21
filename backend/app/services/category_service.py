"""Service — catégories (lecture publique, création admin)."""
from __future__ import annotations

import time
from typing import Any

from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Category
from app.repositories.category_repository import CategoryRepository
from app.utils.responses import ApiError


_CATEGORY_CACHE: dict[str, Any] = {"at": 0.0, "items": []}
_CATEGORY_CACHE_TTL_SEC = 120


class CategoryService:
    def __init__(self) -> None:
        self._categories = CategoryRepository(db.session)

    @staticmethod
    def serialize(category) -> dict[str, Any]:
        return {"id": category.id, "name": category.name}

    def list_categories(self) -> list[dict[str, Any]]:
        now = time.monotonic()
        if _CATEGORY_CACHE["items"] and now - _CATEGORY_CACHE["at"] < _CATEGORY_CACHE_TTL_SEC:
            return _CATEGORY_CACHE["items"]
        items = [self.serialize(c) for c in self._categories.list_all()]
        _CATEGORY_CACHE["at"] = now
        _CATEGORY_CACHE["items"] = items
        return items

    @staticmethod
    def invalidate_public_cache() -> None:
        _CATEGORY_CACHE["at"] = 0.0
        _CATEGORY_CACHE["items"] = []

    def create_category(self, name: str) -> dict[str, Any]:
        label = name.strip()
        if not label:
            raise ApiError("Le nom de la catégorie est obligatoire.", status=422)
        existing = self._categories.find_by_name(label)
        if existing is not None:
            raise ApiError("Cette catégorie existe déjà.", status=409)
        category = Category(name=label)
        db.session.add(category)
        try:
            db.session.commit()
        except IntegrityError as err:
            db.session.rollback()
            raise ApiError("Cette catégorie existe déjà.", status=409) from err
        self.invalidate_public_cache()
        return self.serialize(category)
