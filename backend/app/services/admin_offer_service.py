"""Administration — offres (module 7)."""
from __future__ import annotations

from typing import Any

from app.extensions import db
from app.models.enums import OfferStatus
from app.repositories.offer_repository import OfferRepository
from app.services.offer_service import OfferService
from app.utils.pagination import normalize_page_params, pagination_meta
from app.utils.responses import ApiError


class AdminOfferService:
    def __init__(self) -> None:
        self._offers = OfferRepository(db.session)
        self._serializer = OfferService()

    def _parse_status(self, value: str | None) -> OfferStatus | None:
        if not value:
            return None
        try:
            return OfferStatus(value)
        except ValueError as err:
            raise ApiError("Statut d'offre inconnu.", status=422) from err

    def list_offers(
        self,
        *,
        status: str | None,
        page: int | None,
        per_page: int | None,
    ) -> dict[str, Any]:
        page, per_page = normalize_page_params(page, per_page, default=20)
        status_enum = self._parse_status(status)
        total = self._offers.count_admin(status=status_enum)
        offers = self._offers.list_admin(status=status_enum, page=page, per_page=per_page)
        return {
            "offers": [
                {
                    **self._serializer.serialize_offer_merchant(o),
                    "store_id": o.product.store_id,
                    "store_name": o.product.store.name,
                }
                for o in offers
            ],
            "pagination": pagination_meta(total, page, per_page),
        }

    def get_offer_detail(self, offer_id: int) -> dict[str, Any]:
        offer = self._offers.find_detail(offer_id)
        if offer is None:
            raise ApiError("Offre introuvable.", status=404)
        payload = self._serializer.serialize_offer_consumer(offer)
        payload["store"]["validation_status"] = offer.product.store.validation_status.value
        return payload

    def deactivate(self, offer_id: int) -> dict[str, Any]:
        offer = self._offers.find_by_id(offer_id)
        if offer is None:
            raise ApiError("Offre introuvable.", status=404)
        offer.status = OfferStatus.DESACTIVEE
        db.session.commit()
        return self._serializer.serialize_offer_merchant(offer)

    def withdraw(self, offer_id: int) -> dict[str, Any]:
        offer = self._offers.find_by_id(offer_id)
        if offer is None:
            raise ApiError("Offre introuvable.", status=404)
        offer.status = OfferStatus.RETIREE
        db.session.commit()
        return self._serializer.serialize_offer_merchant(offer)
