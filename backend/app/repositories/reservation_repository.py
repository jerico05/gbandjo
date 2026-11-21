"""Accès données — Reservation."""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import Offer, Product, Reservation
from app.models.enums import ReservationStatus
from app.utils import utcnow


class ReservationRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def find_by_id(self, reservation_id: int) -> Reservation | None:
        return self._session.get(Reservation, reservation_id)

    def find_detail(self, reservation_id: int) -> Reservation | None:
        statement = (
            select(Reservation)
            .where(Reservation.id == reservation_id)
            .options(
                joinedload(Reservation.offer).joinedload(Offer.product).joinedload(Product.store),
                joinedload(Reservation.consumer),
            )
        )
        return self._session.scalar(statement)

    def list_by_consumer(self, consumer_id: int) -> list[Reservation]:
        statement = (
            select(Reservation)
            .where(Reservation.consumer_id == consumer_id)
            .options(joinedload(Reservation.offer).joinedload(Offer.product))
            .order_by(Reservation.created_at.desc())
        )
        return list(self._session.scalars(statement))

    def list_by_store(self, store_id: int) -> list[Reservation]:
        statement = (
            select(Reservation)
            .join(Offer)
            .join(Product)
            .where(Product.store_id == store_id)
            .options(
                joinedload(Reservation.offer).joinedload(Offer.product).joinedload(Product.store),
                joinedload(Reservation.consumer),
            )
            .order_by(Reservation.created_at.desc())
        )
        return list(self._session.scalars(statement))

    def lock_offer(self, offer_id: int) -> Offer | None:
        statement = select(Offer).where(Offer.id == offer_id).with_for_update()
        return self._session.scalar(statement)

    def find_active_by_consumer_and_offer(
        self, consumer_id: int, offer_id: int
    ) -> Reservation | None:
        """Réservation encore active (en attente ou confirmée) pour un couple consommateur / offre."""
        statement = (
            select(Reservation)
            .where(
                Reservation.consumer_id == consumer_id,
                Reservation.offer_id == offer_id,
                Reservation.status.in_(
                    (ReservationStatus.EN_ATTENTE, ReservationStatus.CONFIRMEE)
                ),
            )
            .order_by(Reservation.created_at.desc())
            .limit(1)
        )
        return self._session.scalar(statement)

    def find_pending_expired(self, at=None) -> list[Reservation]:
        moment = at or utcnow()
        return list(
            self._session.scalars(
                select(Reservation).where(
                    Reservation.status == ReservationStatus.EN_ATTENTE,
                    Reservation.expires_at <= moment,
                )
            )
        )

    def mark_expired(self, reservation: Reservation, at=None) -> None:
        moment = at or utcnow()
        reservation.status = ReservationStatus.EXPIREE
        reservation.processed_at = moment

    def add(self, reservation: Reservation) -> Reservation:
        self._session.add(reservation)
        self._session.flush()
        return reservation
