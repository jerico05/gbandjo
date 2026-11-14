"""Accès données — Offer."""
from __future__ import annotations

from decimal import Decimal

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models import Offer, Product, Store
from app.models.enums import OfferStatus, ValidationStatus
from app.utils import utcnow


class OfferRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def _consumer_base_statement(self):
        now = utcnow()
        return (
            select(Offer)
            .join(Product)
            .join(Store, Product.store_id == Store.id)
            .where(
                Offer.status == OfferStatus.ACTIVE,
                Store.validation_status == ValidationStatus.VALIDE,
                Product.is_active.is_(True),
                Offer.ends_at > now,
                Offer.available_quantity > 0,
            )
            .options(
                joinedload(Offer.product).selectinload(Product.images),
                joinedload(Offer.product).joinedload(Product.category),
                joinedload(Offer.product).joinedload(Product.store),
            )
        )

    def find_by_id(self, offer_id: int) -> Offer | None:
        return self._session.get(Offer, offer_id)

    def find_detail(self, offer_id: int) -> Offer | None:
        statement = (
            select(Offer)
            .where(Offer.id == offer_id)
            .options(
                joinedload(Offer.product).selectinload(Product.images),
                joinedload(Offer.product).joinedload(Product.category),
                joinedload(Offer.product).joinedload(Product.store),
            )
        )
        return self._session.scalar(statement)

    def list_for_store(self, store_id: int) -> list[Offer]:
        statement = (
            select(Offer)
            .join(Product)
            .where(Product.store_id == store_id)
            .options(joinedload(Offer.product))
            .order_by(Offer.starts_at.desc())
        )
        return list(self._session.scalars(statement))

    def list_active_filtered(
        self,
        *,
        category_id: int | None = None,
        search: str | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
        min_discount: Decimal | None = None,
    ) -> list[Offer]:
        statement = self._consumer_base_statement()
        if category_id is not None:
            statement = statement.where(Product.category_id == category_id)
        if search:
            pattern = f"%{search.strip()}%"
            statement = statement.where(
                or_(Product.name.ilike(pattern), Store.name.ilike(pattern))
            )
        if min_price is not None:
            statement = statement.where(Offer.discounted_price >= min_price)
        if max_price is not None:
            statement = statement.where(Offer.discounted_price <= max_price)
        offers = list(self._session.scalars(statement))
        if min_discount is not None:
            offers = [o for o in offers if o.discount_percentage >= min_discount]
        return offers

    def add(self, offer: Offer) -> Offer:
        self._session.add(offer)
        self._session.flush()
        return offer

    def list_admin(
        self,
        *,
        status: OfferStatus | None,
        page: int,
        per_page: int,
    ) -> list[Offer]:
        from sqlalchemy import func

        statement = (
            select(Offer)
            .join(Product)
            .join(Store, Product.store_id == Store.id)
            .options(
                joinedload(Offer.product).joinedload(Product.store),
            )
            .order_by(Offer.starts_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        if status is not None:
            statement = statement.where(Offer.status == status)
        return list(self._session.scalars(statement))

    def count_admin(self, *, status: OfferStatus | None) -> int:
        from sqlalchemy import func

        statement = select(func.count()).select_from(Offer)
        if status is not None:
            statement = statement.where(Offer.status == status)
        return self._session.scalar(statement) or 0

    def count_by_status(self) -> dict[str, int]:
        from sqlalchemy import func

        rows = self._session.execute(select(Offer.status, func.count()).group_by(Offer.status)).all()
        return {status.value: count for status, count in rows}
