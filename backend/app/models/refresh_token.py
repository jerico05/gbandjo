"""Revocable refresh tokens."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db
from app.utils import utcnow


class RefreshToken(db.Model):
    __tablename__ = "refresh_token"
    __table_args__ = (UniqueConstraint("jeton_hash", name="uq_refresh_token_jeton_hash"),)

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[int] = mapped_column("utilisateur_id", BigInteger, ForeignKey("utilisateur.id", ondelete="CASCADE"), index=True)
    token_hash: Mapped[str] = mapped_column("jeton_hash", String(64))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship()  # noqa: F821

    @property
    def is_valid(self) -> bool:
        return self.revoked_at is None and self.expires_at > utcnow()
