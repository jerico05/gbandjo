"""Administration — statistiques globales (module 7)."""
from __future__ import annotations

from typing import Any

from datetime import timedelta

from sqlalchemy import func, select

from app.extensions import db
from app.models import Offer, Reservation, Store, User
from app.utils import utcnow
from app.repositories.offer_repository import OfferRepository
from app.repositories.store_repository import StoreRepository
from app.repositories.user_repository import UserRepository


class DashboardService:
    def __init__(self) -> None:
        self._users = UserRepository(db.session)
        self._stores = StoreRepository(db.session)
        self._offers = OfferRepository(db.session)

    def global_stats(self) -> dict[str, Any]:
        users_total = db.session.scalar(select(func.count()).select_from(User)) or 0
        stores_total = db.session.scalar(select(func.count()).select_from(Store)) or 0
        offers_total = db.session.scalar(select(func.count()).select_from(Offer)) or 0
        reservations_total = db.session.scalar(select(func.count()).select_from(Reservation)) or 0
        day_start = utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        reservations_today = db.session.scalar(
            select(func.count())
            .select_from(Reservation)
            .where(Reservation.created_at >= day_start, Reservation.created_at < day_end)
        ) or 0
        return {
            "totals": {
                "users": users_total,
                "stores": stores_total,
                "offers": offers_total,
                "reservations": reservations_total,
            },
            "users_by_role": self._users.count_by_role(),
            "users_by_account_status": self._users.count_by_status(),
            "stores_by_validation_status": self._stores.count_by_validation_status(),
            "offers_by_status": self._offers.count_by_status(),
            "reservations_activity": reservations_today,
        }
