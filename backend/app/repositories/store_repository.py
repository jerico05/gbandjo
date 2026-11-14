"""Accès données — Store."""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Store
from app.models.enums import ValidationStatus


class StoreRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def find_by_id(self, store_id: int) -> Store | None:
        return self._session.get(Store, store_id)

    def find_by_owner_id(self, owner_id: int) -> Store | None:
        return self._session.scalar(select(Store).where(Store.owner_id == owner_id))

    def list_by_validation_status(
        self, status: ValidationStatus | None = None
    ) -> list[Store]:
        statement = select(Store).order_by(Store.created_at.desc())
        if status is not None:
            statement = statement.where(Store.validation_status == status)
        return list(self._session.scalars(statement))

    def add(self, store: Store) -> Store:
        self._session.add(store)
        self._session.flush()
        return store

    def count_by_validation_status(self) -> dict[str, int]:
        from sqlalchemy import func

        rows = self._session.execute(
            select(Store.validation_status, func.count()).group_by(Store.validation_status)
        ).all()
        return {status.value: count for status, count in rows}
