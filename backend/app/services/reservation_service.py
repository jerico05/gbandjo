"""Service métier — réservations (module 5)."""
from __future__ import annotations

from datetime import datetime
from typing import Any

from flask import current_app

from app.extensions import db
from app.models import Consumer, Reservation
from app.models.enums import OfferStatus, ReservationStatus, UserRole, ValidationStatus
from app.repositories.offer_repository import OfferRepository
from app.repositories.reservation_repository import ReservationRepository
from app.services.notification_service import NotificationService
from app.utils import utcnow
from app.utils.responses import ApiError


class ReservationService:
    def __init__(self) -> None:
        self._reservations = ReservationRepository(db.session)
        self._offers = OfferRepository(db.session)
        self._notify = NotificationService()

    def expire_pending(self) -> int:
        """Expire les réservations EN_ATTENTE dépassées (cron + accès API)."""
        pending = self._reservations.find_pending_expired()
        for reservation in pending:
            self._reservations.mark_expired(reservation)
            self._notify.notify_reservation(
                recipient_id=reservation.consumer_id,
                reservation_id=reservation.id,
                type_code="RESERVATION_EXPIREE",
                message="Votre réservation a expiré faute de confirmation à temps.",
            )
        if pending:
            db.session.commit()
        return len(pending)

    @staticmethod
    def serialize(reservation: Reservation) -> dict[str, Any]:
        offer = reservation.offer
        product = offer.product if offer else None
        return {
            "id": reservation.id,
            "offer_id": reservation.offer_id,
            "offer_label": product.name if product else None,
            "consumer_id": reservation.consumer_id,
            "quantity": reservation.quantity,
            "unit_price": str(reservation.unit_price),
            "status": reservation.status.value,
            "created_at": reservation.created_at.isoformat(),
            "expires_at": reservation.expires_at.isoformat(),
            "processed_at": reservation.processed_at.isoformat() if reservation.processed_at else None,
            "reason": reservation.reason,
            "cancelled_by_role": reservation.cancelled_by_role.value if reservation.cancelled_by_role else None,
        }

    def _ensure_consumer(self, user) -> None:
        if user.role != UserRole.CONSOMMATEUR:
            raise ApiError("Réservé aux consommateurs.", status=403)

    def _validate_offer_for_reservation(self, offer_id: int):
        offer = self._offers.find_detail(offer_id)
        if offer is None:
            raise ApiError("Offre introuvable.", status=404)
        store = offer.product.store
        if store.validation_status != ValidationStatus.VALIDE:
            raise ApiError("Offre indisponible.", status=404)
        if offer.status != OfferStatus.ACTIVE or not offer.product.is_active:
            raise ApiError("Offre indisponible.", status=404)
        if offer.is_expired() or offer.is_sold_out:
            raise ApiError("Offre indisponible.", status=404)
        return offer

    def create_reservation(self, consumer: Consumer, payload: dict[str, Any]) -> dict[str, Any]:
        self._ensure_consumer(consumer)
        self.expire_pending()
        offer = self._validate_offer_for_reservation(payload["offer_id"])
        quantity = payload["quantity"]
        if quantity <= 0:
            raise ApiError("La quantité doit être strictement positive (RG10).", status=422)
        if quantity > offer.available_quantity:
            raise ApiError(
                "Quantité demandée supérieure au stock disponible (RG10).",
                status=422,
            )
        reservation = Reservation(
            offer_id=offer.id,
            consumer_id=consumer.id,
            quantity=quantity,
            unit_price=offer.discounted_price,
            status=ReservationStatus.EN_ATTENTE,
        )
        self._reservations.add(reservation)
        owner_id = offer.product.store.owner_id
        self._notify.notify_reservation(
            recipient_id=owner_id,
            reservation_id=reservation.id,
            type_code="RESERVATION_CREEE",
            message=f"Nouvelle réservation ({quantity} unité(s)) sur l'offre #{offer.id}.",
        )
        self._notify.notify_reservation(
            recipient_id=consumer.id,
            reservation_id=reservation.id,
            type_code="RESERVATION_EN_ATTENTE",
            message="Votre réservation est en attente de confirmation par le commerçant.",
        )
        db.session.commit()
        return self.serialize(self._reservations.find_detail(reservation.id))

    def list_consumer_reservations(self, consumer: Consumer) -> list[dict[str, Any]]:
        self._ensure_consumer(consumer)
        self.expire_pending()
        items = self._reservations.list_by_consumer(consumer.id)
        return [self.serialize(r) for r in items]

    def cancel_by_consumer(self, consumer: Consumer, reservation_id: int) -> dict[str, Any]:
        self._ensure_consumer(consumer)
        self.expire_pending()
        reservation = self._reservations.find_detail(reservation_id)
        if reservation is None or reservation.consumer_id != consumer.id:
            raise ApiError("Réservation introuvable.", status=404)
        if reservation.status != ReservationStatus.EN_ATTENTE:
            raise ApiError("Seules les réservations en attente peuvent être annulées.", status=409)
        reservation.status = ReservationStatus.ANNULEE
        reservation.cancelled_by_role = UserRole.CONSOMMATEUR
        reservation.processed_at = utcnow()
        owner_id = reservation.offer.product.store.owner_id
        self._notify.notify_reservation(
            recipient_id=owner_id,
            reservation_id=reservation.id,
            type_code="RESERVATION_ANNULEE",
            message=f"Réservation #{reservation.id} annulée par le client.",
        )
        db.session.commit()
        return self.serialize(reservation)

    def list_merchant_reservations(self, store) -> list[dict[str, Any]]:
        self.expire_pending()
        items = self._reservations.list_by_store(store.id)
        return [self.serialize(r) for r in items]

    def confirm(self, store, reservation_id: int) -> dict[str, Any]:
        self.expire_pending()
        reservation = self._reservations.find_detail(reservation_id)
        if reservation is None or reservation.offer.product.store_id != store.id:
            raise ApiError("Réservation introuvable.", status=404)
        if reservation.status != ReservationStatus.EN_ATTENTE:
            raise ApiError("Seules les réservations en attente peuvent être confirmées.", status=409)
        offer = self._reservations.lock_offer(reservation.offer_id)
        if offer is None:
            raise ApiError("Offre introuvable.", status=404)
        if offer.available_quantity < reservation.quantity:
            raise ApiError(
                "Stock insuffisant pour confirmer cette réservation (RG13).",
                status=409,
            )
        offer.available_quantity -= reservation.quantity
        if offer.available_quantity == 0 and offer.status == OfferStatus.ACTIVE:
            offer.status = OfferStatus.DESACTIVEE
        reservation.status = ReservationStatus.CONFIRMEE
        reservation.processed_at = utcnow()
        self._notify.notify_reservation(
            recipient_id=reservation.consumer_id,
            reservation_id=reservation.id,
            type_code="RESERVATION_CONFIRMEE",
            message="Votre réservation a été confirmée par le commerçant.",
        )
        db.session.commit()
        return self.serialize(self._reservations.find_detail(reservation_id))

    def reject(self, store, reservation_id: int, reason: str | None) -> dict[str, Any]:
        self.expire_pending()
        reservation = self._reservations.find_detail(reservation_id)
        if reservation is None or reservation.offer.product.store_id != store.id:
            raise ApiError("Réservation introuvable.", status=404)
        if reservation.status != ReservationStatus.EN_ATTENTE:
            raise ApiError("Seules les réservations en attente peuvent être rejetées.", status=409)
        reservation.status = ReservationStatus.REJETEE
        reservation.reason = (reason or "").strip() or None
        reservation.processed_at = utcnow()
        self._notify.notify_reservation(
            recipient_id=reservation.consumer_id,
            reservation_id=reservation.id,
            type_code="RESERVATION_REJETEE",
            message=reservation.reason or "Votre réservation a été rejetée par le commerçant.",
        )
        db.session.commit()
        return self.serialize(reservation)

    def mark_picked_up(self, store, reservation_id: int) -> dict[str, Any]:
        reservation = self._reservations.find_detail(reservation_id)
        if reservation is None or reservation.offer.product.store_id != store.id:
            raise ApiError("Réservation introuvable.", status=404)
        if reservation.status != ReservationStatus.CONFIRMEE:
            raise ApiError("Seules les réservations confirmées peuvent être marquées retirées.", status=409)
        reservation.status = ReservationStatus.RETIREE
        reservation.processed_at = utcnow()
        self._notify.notify_reservation(
            recipient_id=reservation.consumer_id,
            reservation_id=reservation.id,
            type_code="RESERVATION_RETIREE",
            message="Retrait enregistré. Merci pour votre achat.",
        )
        db.session.commit()
        return self.serialize(reservation)

    def cancel_by_merchant(self, store, reservation_id: int, reason: str | None) -> dict[str, Any]:
        reservation = self._reservations.find_detail(reservation_id)
        if reservation is None or reservation.offer.product.store_id != store.id:
            raise ApiError("Réservation introuvable.", status=404)
        if reservation.status != ReservationStatus.CONFIRMEE:
            raise ApiError(
                "Seules les réservations confirmées peuvent être annulées par le commerçant.",
                status=409,
            )
        offer = self._reservations.lock_offer(reservation.offer_id)
        if offer:
            offer.available_quantity += reservation.quantity
            if offer.status == OfferStatus.DESACTIVEE and offer.available_quantity > 0 and not offer.is_expired():
                offer.status = OfferStatus.ACTIVE
        reservation.status = ReservationStatus.ANNULEE
        reservation.cancelled_by_role = UserRole.COMMERCANT
        reservation.reason = (reason or "").strip() or None
        reservation.processed_at = utcnow()
        self._notify.notify_reservation(
            recipient_id=reservation.consumer_id,
            reservation_id=reservation.id,
            type_code="RESERVATION_ANNULEE_COMMERCANT",
            message=reservation.reason or "Votre réservation confirmée a été annulée par le commerçant.",
        )
        db.session.commit()
        return self.serialize(reservation)

    def run_internal_expiration(self, api_key: str | None) -> dict[str, Any]:
        expected = current_app.config.get("INTERNAL_CRON_KEY") or ""
        if expected and api_key != expected:
            raise ApiError("Clé interne invalide.", status=403)
        if not expected and not current_app.config.get("TESTING") and not current_app.debug:
            raise ApiError("Route interne non configurée (INTERNAL_CRON_KEY).", status=503)
        count = self.expire_pending()
        return {"expired_count": count}
