"""Accès données — Product et ProductImage."""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Product, ProductImage


class ProductRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_by_store(self, store_id: int) -> list[Product]:
        statement = (
            select(Product)
            .where(Product.store_id == store_id)
            .options(
                selectinload(Product.images),
                selectinload(Product.category),
            )
            .order_by(Product.name)
        )
        return list(self._session.scalars(statement))

    def find_for_store(self, product_id: int, store_id: int) -> Product | None:
        statement = (
            select(Product)
            .where(Product.id == product_id, Product.store_id == store_id)
            .options(
                selectinload(Product.images),
                selectinload(Product.category),
                selectinload(Product.offers),
            )
        )
        return self._session.scalar(statement)

    def add(self, product: Product) -> Product:
        self._session.add(product)
        self._session.flush()
        return product

    def add_image(self, image: ProductImage) -> ProductImage:
        self._session.add(image)
        self._session.flush()
        return image

    def find_image(self, image_id: int, product_id: int) -> ProductImage | None:
        return self._session.scalar(
            select(ProductImage).where(ProductImage.id == image_id, ProductImage.product_id == product_id)
        )
