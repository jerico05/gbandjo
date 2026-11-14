"""User and role specializations (single-table inheritance)."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import BigInteger, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db
from app.models.column_types import enum_column
from app.models.enums import AccountStatus, UserRole
from app.utils import utcnow


class User(db.Model):
    __tablename__ = "utilisateur"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    last_name: Mapped[str] = mapped_column("nom", String(100))
    first_name: Mapped[str] = mapped_column("prenoms", String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    phone: Mapped[str | None] = mapped_column("telephone", String(30))
    password_hash: Mapped[str] = mapped_column("mot_de_passe_hash", String(255))
    role: Mapped[UserRole] = mapped_column(enum_column(UserRole, "role_utilisateur"))
    account_status: Mapped[AccountStatus] = mapped_column(
        "statut",
        enum_column(AccountStatus, "statut_compte"),
        default=AccountStatus.ACTIF,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    notifications: Mapped[list["Notification"]] = relationship(  # noqa: F821
        back_populates="recipient", cascade="all, delete-orphan"
    )

    __mapper_args__ = {"polymorphic_on": "role"}

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    @property
    def can_login(self) -> bool:
        return self.account_status == AccountStatus.ACTIF


class Admin(User):
    __mapper_args__ = {"polymorphic_identity": UserRole.ADMIN}


class Merchant(User):
    __mapper_args__ = {"polymorphic_identity": UserRole.COMMERCANT}

    store: Mapped["Store | None"] = relationship(back_populates="owner", uselist=False)  # noqa: F821


class Consumer(User):
    __mapper_args__ = {"polymorphic_identity": UserRole.CONSOMMATEUR}

    reservations: Mapped[list["Reservation"]] = relationship(back_populates="consumer")  # noqa: F821
