"""In-app notification."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.utils import utcnow


class Notification(db.Model):
    __tablename__ = "notification"
    __table_args__ = (Index("ix_notification_destinataire_lue", "destinataire_id", "lue"),)

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    recipient_id: Mapped[int] = mapped_column("destinataire_id", BigInteger, ForeignKey("utilisateur.id", ondelete="CASCADE"))
    reservation_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("reservation.id", ondelete="SET NULL")
    )
    type: Mapped[str] = mapped_column(String(50))
    message: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column("lue", Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    recipient: Mapped["User"] = relationship(back_populates="notifications")  # noqa: F821
    reservation: Mapped["Reservation | None"] = relationship(back_populates="notifications")  # noqa: F821
