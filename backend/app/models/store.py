"""Merchant store."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import BigInteger, CheckConstraint, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.column_types import enum_column
from app.models.enums import ValidationStatus
from app.utils import utcnow


class Store(db.Model):
    __tablename__ = "commerce"
    __table_args__ = (
        CheckConstraint("latitude BETWEEN -90 AND 90", name="latitude_valide"),
        CheckConstraint("longitude BETWEEN -180 AND 180", name="longitude_valide"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    owner_id: Mapped[int] = mapped_column("proprietaire_id", BigInteger, ForeignKey("utilisateur.id"), unique=True)
    name: Mapped[str] = mapped_column("nom", String(150))
    description: Mapped[str | None] = mapped_column(Text)
    activity_type: Mapped[str] = mapped_column("type_activite", String(100))
    address: Mapped[str] = mapped_column("adresse", String(255))
    phone: Mapped[str | None] = mapped_column("telephone", String(30))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    validation_status: Mapped[ValidationStatus] = mapped_column(
        "statut_validation", enum_column(ValidationStatus, "statut_validation"), default=ValidationStatus.EN_ATTENTE
    )
    rejection_reason: Mapped[str | None] = mapped_column("motif_rejet", Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    owner: Mapped["Merchant"] = relationship(back_populates="store")  # noqa: F821
    products: Mapped[list["Product"]] = relationship(back_populates="store")  # noqa: F821

    @property
    def is_validated(self) -> bool:
        return self.validation_status == ValidationStatus.VALIDE
