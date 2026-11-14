"""Categories, products, images, and offers."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger, Boolean, CheckConstraint, Date, DateTime, ForeignKey, Index,
    Integer, Numeric, String, Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.column_types import enum_column
from app.models.enums import OfferStatus
from app.utils import as_utc, utcnow


class Category(db.Model):
    __tablename__ = "categorie"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column("nom", String(100), unique=True)

    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(db.Model):
    __tablename__ = "produit"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    store_id: Mapped[int] = mapped_column("commerce_id", BigInteger, ForeignKey("commerce.id"))
    category_id: Mapped[int] = mapped_column("categorie_id", BigInteger, ForeignKey("categorie.id"))
    name: Mapped[str] = mapped_column("nom", String(150))
    description: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column("actif", Boolean, default=True)

    store: Mapped["Store"] = relationship(back_populates="products")  # noqa: F821
    category: Mapped[Category] = relationship(back_populates="products")
    images: Mapped[list["ProductImage"]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order"
    )
    offers: Mapped[list["Offer"]] = relationship(back_populates="product")


class ProductImage(db.Model):
    __tablename__ = "image_produit"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    product_id: Mapped[int] = mapped_column("produit_id", BigInteger, ForeignKey("produit.id", ondelete="CASCADE"))
    url: Mapped[str] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column("ordre", Integer, default=0)

    product: Mapped[Product] = relationship(back_populates="images")


class Offer(db.Model):
    __tablename__ = "offre"
    __table_args__ = (
        CheckConstraint("prix_reduit >= 0", name="prix_reduit_positif"),
        CheckConstraint("prix_reduit < prix_initial", name="prix_reduit_inferieur"),
        CheckConstraint("quantite_disponible >= 0", name="quantite_positive"),
        CheckConstraint("date_fin > date_debut", name="dates_coherentes"),
        Index("ix_offre_statut_date_fin", "statut", "date_fin"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    product_id: Mapped[int] = mapped_column("produit_id", BigInteger, ForeignKey("produit.id"))
    initial_price: Mapped[Decimal] = mapped_column("prix_initial", Numeric(10, 2))
    discounted_price: Mapped[Decimal] = mapped_column("prix_reduit", Numeric(10, 2))
    available_quantity: Mapped[int] = mapped_column("quantite_disponible", Integer)
    starts_at: Mapped[datetime] = mapped_column("date_debut", DateTime(timezone=True))
    ends_at: Mapped[datetime] = mapped_column("date_fin", DateTime(timezone=True))
    expiry_date: Mapped[date | None] = mapped_column("date_peremption", Date)
    status: Mapped[OfferStatus] = mapped_column(
        "statut", enum_column(OfferStatus, "statut_offre"), default=OfferStatus.ACTIVE
    )

    product: Mapped[Product] = relationship(back_populates="offers")
    reservations: Mapped[list["Reservation"]] = relationship(back_populates="offer")  # noqa: F821

    @property
    def discount_percentage(self) -> Decimal:
        if not self.initial_price:
            return Decimal("0.00")
        reduction = (self.initial_price - self.discounted_price) / self.initial_price * 100
        return reduction.quantize(Decimal("0.01"))

    @property
    def is_sold_out(self) -> bool:
        return self.available_quantity <= 0

    def is_expired(self, at: datetime | None = None) -> bool:
        return as_utc(self.ends_at) <= (at or utcnow())
