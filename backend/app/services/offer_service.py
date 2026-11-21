"""Service métier — offres (module 4)."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Offer
from app.models.enums import OfferStatus, ValidationStatus
from app.repositories.offer_repository import OfferRepository
from app.repositories.product_repository import ProductRepository
from app.utils import as_utc, utcnow
from app.utils.geo import haversine_km
from app.utils.responses import ApiError


class OfferService:
    def __init__(self) -> None:
        self._offers = OfferRepository(db.session)
        self._products = ProductRepository(db.session)

    @staticmethod
    def _parse_decimal(value) -> Decimal:
        return Decimal(str(value))

    def _validate_prices(self, initial, discounted) -> None:
        """RG4 — cohérence des prix."""
        initial_price = self._parse_decimal(initial)
        discounted_price = self._parse_decimal(discounted)
        if initial_price <= 0:
            raise ApiError("Le prix initial doit être strictement positif.", status=422)
        if discounted_price < 0:
            raise ApiError("Le prix réduit ne peut pas être négatif.", status=422)
        if discounted_price >= initial_price:
            raise ApiError("Le prix réduit doit être strictement inférieur au prix initial (RG4).", status=422)

    def _validate_dates(self, starts_at: datetime, ends_at: datetime) -> None:
        if as_utc(ends_at) <= as_utc(starts_at):
            raise ApiError("La date de fin doit être postérieure à la date de début.", status=422)

    def _validate_expiry(self, ends_at: datetime, expiry_date: date | None) -> None:
        """RG5 — date de péremption cohérente avec la fin de l'offre."""
        if expiry_date is None:
            return
        if expiry_date < ends_at.date():
            raise ApiError(
                "La date de péremption ne peut pas être antérieure à la fin de l'offre (RG5).",
                status=422,
            )

    def _validate_quantity(self, quantity: int) -> None:
        if quantity < 0:
            raise ApiError("La quantité disponible ne peut pas être négative.", status=422)

    def serialize_offer_merchant(self, offer: Offer) -> dict[str, Any]:
        return {
            "id": offer.id,
            "product_id": offer.product_id,
            "product_name": offer.product.name if offer.product else None,
            "initial_price": str(offer.initial_price),
            "discounted_price": str(offer.discounted_price),
            "discount_percentage": str(offer.discount_percentage),
            "available_quantity": offer.available_quantity,
            "starts_at": offer.starts_at.isoformat(),
            "ends_at": offer.ends_at.isoformat(),
            "expiry_date": offer.expiry_date.isoformat() if offer.expiry_date else None,
            "status": offer.status.value,
        }

    @staticmethod
    def _primary_image_url(product) -> str | None:
        if not product.images:
            return None
        return product.images[0].url

    def serialize_offer_consumer_card(self, offer: Offer, *, distance_km: float | None = None) -> dict[str, Any]:
        """Payload allégé pour les listes catalogue (moins de JSON, chargement plus rapide)."""
        product = offer.product
        store = product.store
        return {
            "id": offer.id,
            "initial_price": str(offer.initial_price),
            "discounted_price": str(offer.discounted_price),
            "discount_percentage": str(offer.discount_percentage),
            "available_quantity": offer.available_quantity,
            "starts_at": offer.starts_at.isoformat(),
            "ends_at": offer.ends_at.isoformat(),
            "status": offer.status.value,
            "distance_km": round(distance_km, 2) if distance_km is not None else None,
            "product": {
                "name": product.name,
                "category_name": product.category.name if product.category else None,
                "image_url": self._primary_image_url(product),
            },
            "store": {
                "name": store.name,
                "address": store.address,
            },
        }

    def serialize_offer_consumer(self, offer: Offer, *, distance_km: float | None = None) -> dict[str, Any]:
        product = offer.product
        store = product.store
        primary_url = self._primary_image_url(product)
        return {
            "id": offer.id,
            "initial_price": str(offer.initial_price),
            "discounted_price": str(offer.discounted_price),
            "discount_percentage": str(offer.discount_percentage),
            "available_quantity": offer.available_quantity,
            "starts_at": offer.starts_at.isoformat(),
            "ends_at": offer.ends_at.isoformat(),
            "expiry_date": offer.expiry_date.isoformat() if offer.expiry_date else None,
            "status": offer.status.value,
            "distance_km": round(distance_km, 2) if distance_km is not None else None,
            "product": {
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "category_id": product.category_id,
                "category_name": product.category.name if product.category else None,
                "image_url": primary_url,
                "images": [
                    {"id": img.id, "url": img.url, "sort_order": img.sort_order} for img in product.images
                ],
            },
            "store": {
                "id": store.id,
                "name": store.name,
                "address": store.address,
                "latitude": store.latitude,
                "longitude": store.longitude,
                "phone": store.phone,
            },
        }

    def _ensure_product_owned(self, store, product_id: int):
        product = self._products.find_for_store(product_id, store.id)
        if product is None:
            raise ApiError("Produit introuvable pour ce commerce.", status=404)
        if not product.is_active:
            raise ApiError("Le produit n'est pas actif.", status=422)
        return product

    def _ensure_offer_owned(self, store, offer_id: int) -> Offer:
        offer = self._offers.find_by_id(offer_id)
        if offer is None or offer.product.store_id != store.id:
            raise ApiError("Offre introuvable.", status=404)
        return offer

    def list_merchant_offers(self, store) -> list[dict[str, Any]]:
        offers = self._offers.list_for_store(store.id)
        return [self.serialize_offer_merchant(o) for o in offers]

    def create_offer(self, store, payload: dict[str, Any]) -> dict[str, Any]:
        product = self._ensure_product_owned(store, payload["product_id"])
        self._validate_prices(payload["initial_price"], payload["discounted_price"])
        self._validate_quantity(payload["available_quantity"])
        starts_at = payload["starts_at"]
        ends_at = payload["ends_at"]
        self._validate_dates(starts_at, ends_at)
        expiry = payload.get("expiry_date")
        self._validate_expiry(ends_at, expiry)
        offer = Offer(
            product_id=product.id,
            initial_price=self._parse_decimal(payload["initial_price"]),
            discounted_price=self._parse_decimal(payload["discounted_price"]),
            available_quantity=payload["available_quantity"],
            starts_at=starts_at,
            ends_at=ends_at,
            expiry_date=expiry,
            status=OfferStatus.ACTIVE,
        )
        try:
            self._offers.add(offer)
            db.session.commit()
        except IntegrityError as err:
            db.session.rollback()
            raise ApiError("Données d'offre invalides (contraintes RG4).", status=422) from err
        return self.serialize_offer_merchant(self._offers.find_by_id(offer.id))

    def update_offer(self, store, offer_id: int, payload: dict[str, Any]) -> dict[str, Any]:
        offer = self._ensure_offer_owned(store, offer_id)
        if offer.status == OfferStatus.RETIREE:
            raise ApiError("Une offre retirée ne peut plus être modifiée.", status=409)
        initial = payload.get("initial_price", offer.initial_price)
        discounted = payload.get("discounted_price", offer.discounted_price)
        self._validate_prices(initial, discounted)
        quantity = payload.get("available_quantity", offer.available_quantity)
        self._validate_quantity(quantity)
        starts_at = payload.get("starts_at", offer.starts_at)
        ends_at = payload.get("ends_at", offer.ends_at)
        self._validate_dates(starts_at, ends_at)
        expiry = payload.get("expiry_date", offer.expiry_date)
        if "expiry_date" in payload:
            expiry = payload["expiry_date"]
        self._validate_expiry(ends_at, expiry)
        offer.initial_price = self._parse_decimal(initial)
        offer.discounted_price = self._parse_decimal(discounted)
        offer.available_quantity = quantity
        offer.starts_at = starts_at
        offer.ends_at = ends_at
        offer.expiry_date = expiry
        try:
            db.session.commit()
        except IntegrityError as err:
            db.session.rollback()
            raise ApiError("Données d'offre invalides (contraintes RG4).", status=422) from err
        return self.serialize_offer_merchant(offer)

    def deactivate_offer(self, store, offer_id: int) -> dict[str, Any]:
        offer = self._ensure_offer_owned(store, offer_id)
        offer.status = OfferStatus.DESACTIVEE
        db.session.commit()
        return self.serialize_offer_merchant(offer)

    def withdraw_offer(self, store, offer_id: int) -> dict[str, Any]:
        offer = self._ensure_offer_owned(store, offer_id)
        offer.status = OfferStatus.RETIREE
        db.session.commit()
        return self.serialize_offer_merchant(offer)

    def _refresh_offer_status(self, offer: Offer) -> None:
        if offer.status != OfferStatus.ACTIVE:
            return
        if offer.is_expired() or offer.is_sold_out:
            offer.status = OfferStatus.DESACTIVEE
            db.session.commit()

    def list_public_offers(self, query: dict[str, Any]) -> dict[str, Any]:
        min_p = Decimal(str(query["min_price"])) if query.get("min_price") is not None else None
        max_p = Decimal(str(query["max_price"])) if query.get("max_price") is not None else None
        min_d = Decimal(str(query["min_discount"])) if query.get("min_discount") is not None else None
        page = max(1, int(query.get("page") or 1))
        per_page = min(100, max(1, int(query.get("per_page") or 48)))
        filters = dict(
            category_id=query.get("category_id"),
            search=query.get("q"),
            min_price=min_p,
            max_price=max_p,
            min_discount=min_d,
        )
        total = self._offers.count_active_filtered(**filters)
        offers = self._offers.list_active_filtered(**filters, page=page, per_page=per_page)
        lat = query.get("latitude")
        lon = query.get("longitude")
        sort = query.get("sort")
        items: list[tuple[float | None, Offer]] = []
        for offer in offers:
            distance = None
            if lat is not None and lon is not None:
                store = offer.product.store
                distance = haversine_km(float(lat), float(lon), store.latitude, store.longitude)
            items.append((distance, offer))
        if sort == "distance":
            if lat is None or lon is None:
                raise ApiError("Les paramètres latitude et longitude sont requis pour le tri par distance.", status=422)
            items.sort(key=lambda pair: pair[0] if pair[0] is not None else float("inf"))
        serialized = [self.serialize_offer_consumer_card(o, distance_km=d) for d, o in items]
        return {
            "offers": serialized,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": max(1, (total + per_page - 1) // per_page),
            },
        }

    def get_public_offer(self, offer_id: int) -> dict[str, Any]:
        offer = self._offers.find_detail(offer_id)
        if offer is None:
            raise ApiError("Offre introuvable.", status=404)
        self._refresh_offer_status(offer)
        if offer.status != OfferStatus.ACTIVE:
            raise ApiError("Cette offre n'est plus disponible.", status=404)
        store = offer.product.store
        if store.validation_status != ValidationStatus.VALIDE or not offer.product.is_active:
            raise ApiError("Cette offre n'est plus disponible.", status=404)
        if offer.is_expired() or offer.is_sold_out:
            raise ApiError("Cette offre n'est plus disponible.", status=404)
        return self.serialize_offer_consumer(offer)
