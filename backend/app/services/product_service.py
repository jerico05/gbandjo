"""Service métier — produits commerçant (module 4)."""
from __future__ import annotations

from typing import Any

from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Product, ProductImage
from app.models.enums import ReservationStatus
from app.repositories.category_repository import CategoryRepository
from app.repositories.product_repository import ProductRepository
from app.utils.cloudinary_storage import upload_product_image
from app.utils.responses import ApiError

_ACTIVE_RESERVATION_STATUSES = {
    ReservationStatus.EN_ATTENTE,
    ReservationStatus.CONFIRMEE,
}


class ProductService:
    def __init__(self) -> None:
        self._products = ProductRepository(db.session)
        self._categories = CategoryRepository(db.session)

    @staticmethod
    def serialize_product(product: Product) -> dict[str, Any]:
        return {
            "id": product.id,
            "store_id": product.store_id,
            "category_id": product.category_id,
            "category_name": product.category.name if product.category else None,
            "name": product.name,
            "description": product.description,
            "is_active": product.is_active,
            "images": [
                {"id": img.id, "url": img.url, "sort_order": img.sort_order} for img in product.images
            ],
        }

    def list_products(self, store) -> list[dict[str, Any]]:
        products = self._products.list_by_store(store.id)
        return [self.serialize_product(p) for p in products]

    def create_product(self, store, payload: dict[str, Any]) -> dict[str, Any]:
        if self._categories.find_by_id(payload["category_id"]) is None:
            raise ApiError("Catégorie introuvable.", status=404)
        product = Product(
            store_id=store.id,
            category_id=payload["category_id"],
            name=payload["name"].strip(),
            description=payload.get("description"),
            is_active=payload.get("is_active", True),
        )
        self._products.add(product)
        db.session.commit()
        return self.serialize_product(self._products.find_for_store(product.id, store.id))

    def update_product(self, store, product_id: int, payload: dict[str, Any]) -> dict[str, Any]:
        product = self._products.find_for_store(product_id, store.id)
        if product is None:
            raise ApiError("Produit introuvable.", status=404)
        if "category_id" in payload and payload["category_id"] is not None:
            if self._categories.find_by_id(payload["category_id"]) is None:
                raise ApiError("Catégorie introuvable.", status=404)
            product.category_id = payload["category_id"]
        if "name" in payload and payload["name"] is not None:
            product.name = payload["name"].strip()
        if "description" in payload:
            product.description = payload["description"]
        if "is_active" in payload and payload["is_active"] is not None:
            product.is_active = payload["is_active"]
        db.session.commit()
        return self.serialize_product(self._products.find_for_store(product_id, store.id))

    def delete_product(self, store, product_id: int) -> None:
        product = self._products.find_for_store(product_id, store.id)
        if product is None:
            raise ApiError("Produit introuvable.", status=404)

        for offer in product.offers:
            for reservation in offer.reservations:
                if reservation.status in _ACTIVE_RESERVATION_STATUSES:
                    raise ApiError(
                        "Impossible de supprimer ce produit : des réservations sont encore en cours. "
                        "Traitez-les d'abord.",
                        status=409,
                    )

        for offer in list(product.offers):
            for reservation in list(offer.reservations):
                db.session.delete(reservation)
            db.session.delete(offer)

        db.session.delete(product)
        db.session.commit()

    def add_image(self, store, product_id: int, payload: dict[str, Any]) -> dict[str, Any]:
        product = self._products.find_for_store(product_id, store.id)
        if product is None:
            raise ApiError("Produit introuvable.", status=404)
        image = ProductImage(
            product_id=product.id,
            url=payload["url"].strip(),
            sort_order=payload.get("sort_order", 0),
        )
        self._products.add_image(image)
        try:
            db.session.commit()
        except IntegrityError as err:
            db.session.rollback()
            raise ApiError("URL d'image invalide.", status=422) from err
        return self.serialize_product(self._products.find_for_store(product_id, store.id))

    def upload_image(self, store, product_id: int, file_storage, sort_order: int = 0) -> dict[str, Any]:
        product = self._products.find_for_store(product_id, store.id)
        if product is None:
            raise ApiError("Produit introuvable.", status=404)
        if file_storage is None or not file_storage.filename:
            raise ApiError("Fichier image requis.", status=422)
        url = upload_product_image(file_storage.stream, product_id=product.id, filename=file_storage.filename)
        return self.add_image(store, product_id, {"url": url, "sort_order": sort_order})

    def delete_image(self, store, product_id: int, image_id: int) -> dict[str, Any]:
        product = self._products.find_for_store(product_id, store.id)
        if product is None:
            raise ApiError("Produit introuvable.", status=404)
        image = self._products.find_image(image_id, product_id)
        if image is None:
            raise ApiError("Image introuvable.", status=404)
        db.session.delete(image)
        db.session.commit()
        return self.serialize_product(self._products.find_for_store(product_id, store.id))
