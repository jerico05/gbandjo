"""Accès données — Category."""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Category


class CategoryRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_all(self) -> list[Category]:
        return list(self._session.scalars(select(Category).order_by(Category.name)))

    def find_by_id(self, category_id: int) -> Category | None:
        return self._session.get(Category, category_id)

    def find_by_name(self, name: str) -> Category | None:
        return self._session.scalar(select(Category).where(Category.name == name.strip()))
