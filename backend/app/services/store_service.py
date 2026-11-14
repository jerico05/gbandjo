"""Service métier — commerces (module 3)."""
from __future__ import annotations

from typing import Any

from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Store
from app.models.enums import UserRole, ValidationStatus
from app.repositories.store_repository import StoreRepository
from app.utils.responses import ApiError


class StoreService:
    def __init__(self) -> None:
        self._stores = StoreRepository(db.session)

    @staticmethod
    def serialize_store(store: Store) -> dict[str, Any]:
        return {
            "id": store.id,
            "owner_id": store.owner_id,
            "name": store.name,
            "description": store.description,
            "activity_type": store.activity_type,
            "address": store.address,
            "phone": store.phone,
            "latitude": store.latitude,
            "longitude": store.longitude,
            "validation_status": store.validation_status.value,
            "rejection_reason": store.rejection_reason,
            "created_at": store.created_at.isoformat(),
        }

    def _ensure_merchant(self, user) -> None:
        if user.role != UserRole.COMMERCANT:
            raise ApiError("Réservé aux commerçants.", status=403)

    def _ensure_admin(self, user) -> None:
        if user.role != UserRole.ADMIN:
            raise ApiError("Réservé aux administrateurs.", status=403)

    def create_store(self, merchant, payload: dict[str, Any]) -> dict[str, Any]:
        self._ensure_merchant(merchant)
        if self._stores.find_by_owner_id(merchant.id) is not None:
            raise ApiError("Ce commerçant a déjà un commerce enregistré.", status=409)
        store = Store(
            owner_id=merchant.id,
            name=payload["name"].strip(),
            description=payload.get("description"),
            activity_type=payload["activity_type"].strip(),
            address=payload["address"].strip(),
            phone=payload.get("phone"),
            latitude=payload["latitude"],
            longitude=payload["longitude"],
            validation_status=ValidationStatus.EN_ATTENTE,
        )
        try:
            self._stores.add(store)
            db.session.commit()
        except IntegrityError as err:
            db.session.rollback()
            raise ApiError("Ce commerçant a déjà un commerce enregistré.", status=409) from err
        return self.serialize_store(store)

    def get_my_store(self, merchant) -> dict[str, Any]:
        self._ensure_merchant(merchant)
        store = self._stores.find_by_owner_id(merchant.id)
        if store is None:
            raise ApiError("Aucun commerce enregistré pour ce compte.", status=404)
        return self.serialize_store(store)

    def update_store(self, merchant, payload: dict[str, Any]) -> dict[str, Any]:
        self._ensure_merchant(merchant)
        store = self._stores.find_by_owner_id(merchant.id)
        if store is None:
            raise ApiError("Aucun commerce enregistré pour ce compte.", status=404)
        if "name" in payload and payload["name"] is not None:
            store.name = payload["name"].strip()
        if "description" in payload:
            store.description = payload["description"]
        if "activity_type" in payload and payload["activity_type"] is not None:
            store.activity_type = payload["activity_type"].strip()
        if "address" in payload and payload["address"] is not None:
            store.address = payload["address"].strip()
        if "phone" in payload:
            store.phone = payload["phone"]
        if "latitude" in payload and payload["latitude"] is not None:
            store.latitude = payload["latitude"]
        if "longitude" in payload and payload["longitude"] is not None:
            store.longitude = payload["longitude"]
        if store.validation_status == ValidationStatus.REJETE:
            store.validation_status = ValidationStatus.EN_ATTENTE
            store.rejection_reason = None
        db.session.commit()
        return self.serialize_store(store)

    def list_stores(self, admin, validation_status: str | None) -> list[dict[str, Any]]:
        self._ensure_admin(admin)
        status = None
        if validation_status is not None:
            try:
                status = ValidationStatus(validation_status)
            except ValueError as err:
                raise ApiError("Statut de validation inconnu.", status=422) from err
        stores = self._stores.list_by_validation_status(status)
        return [self.serialize_store(s) for s in stores]

    def validate_store(self, admin, store_id: int) -> dict[str, Any]:
        self._ensure_admin(admin)
        store = self._stores.find_by_id(store_id)
        if store is None:
            raise ApiError("Commerce introuvable.", status=404)
        if store.validation_status == ValidationStatus.VALIDE:
            raise ApiError("Ce commerce est déjà validé.", status=409)
        store.validation_status = ValidationStatus.VALIDE
        store.rejection_reason = None
        db.session.commit()
        return self.serialize_store(store)

    def reject_store(self, admin, store_id: int, rejection_reason: str) -> dict[str, Any]:
        self._ensure_admin(admin)
        store = self._stores.find_by_id(store_id)
        if store is None:
            raise ApiError("Commerce introuvable.", status=404)
        if store.validation_status == ValidationStatus.VALIDE:
            raise ApiError("Impossible de rejeter un commerce déjà validé.", status=409)
        reason = rejection_reason.strip()
        if not reason:
            raise ApiError("Le motif de rejet est obligatoire.", status=422)
        store.validation_status = ValidationStatus.REJETE
        store.rejection_reason = reason
        db.session.commit()
        return self.serialize_store(store)
