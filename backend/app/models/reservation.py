"""Offer reservation by a consumer."""
from __future__ import annotations

from datetime import datetime, timedelta
from decimal import Decimal

from sqlalchemy import BigInteger, CheckConstraint, DateTime, ForeignKey, Index, Integer, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.models.column_types import enum_column
from app.models.enums import ReservationStatus, UserRole
from app.utils import as_utc, utcnow

RESERVATION_EXPIRATION_DELAY = timedelta(hours=24)


def _default_expiration() -> datetime:
    return utcnow() + RESERVATION_EXPIRATION_DELAY


class Reservation(db.Model):
    __tablename__ = "reservation"
    __table_args__ = (
        CheckConstraint("quantite > 0", name="quantite_positive"),
        CheckConstraint("prix_unitaire >= 0", name="prix_unitaire_positif"),
        Index("ix_reservation_statut_date_expiration", "statut", "date_expiration"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    offer_id: Mapped[int] = mapped_column("offre_id", BigInteger, ForeignKey("offre.id"))
    consumer_id: Mapped[int] = mapped_column("consommateur_id", BigInteger, ForeignKey("utilisateur.id"))
    quantity: Mapped[int] = mapped_column("quantite", Integer)
    unit_price: Mapped[Decimal] = mapped_column("prix_unitaire", Numeric(10, 2))
    status: Mapped[ReservationStatus] = mapped_column(
        "statut", enum_column(ReservationStatus, "statut_reservation"), default=ReservationStatus.EN_ATTENTE
    )
    created_at: Mapped[datetime] = mapped_column("date_creation", DateTime(timezone=True), default=utcnow)
    expires_at: Mapped[datetime] = mapped_column("date_expiration", DateTime(timezone=True), default=_default_expiration)
    processed_at: Mapped[datetime | None] = mapped_column("date_traitement", DateTime(timezone=True))
    reason: Mapped[str | None] = mapped_column("motif", Text)
    cancelled_by_role: Mapped[UserRole | None] = mapped_column(
        "annulee_par", enum_column(UserRole, "role_annulation")
    )

    offer: Mapped["Offer"] = relationship(back_populates="reservations")  # noqa: F821
    consumer: Mapped["Consumer"] = relationship(back_populates="reservations")  # noqa: F821
    notifications: Mapped[list["Notification"]] = relationship(back_populates="reservation")  # noqa: F821

    def is_past_deadline(self, at: datetime | None = None) -> bool:
        return (
            self.status == ReservationStatus.EN_ATTENTE
            and as_utc(self.expires_at) <= (at or utcnow())
        )
