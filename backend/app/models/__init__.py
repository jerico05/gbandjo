"""Register all models with SQLAlchemy and Alembic."""
from app.models.catalog import Category, Offer, Product, ProductImage
from app.models.enums import (
    AccountStatus, OfferStatus, ReservationStatus, UserRole, ValidationStatus,
)
from app.models.notification import Notification
from app.models.refresh_token import RefreshToken
from app.models.reservation import RESERVATION_EXPIRATION_DELAY, Reservation
from app.models.store import Store
from app.models.user import Admin, Consumer, Merchant, User

__all__ = [
    "AccountStatus",
    "Admin",
    "Category",
    "Consumer",
    "Merchant",
    "Notification",
    "Offer",
    "OfferStatus",
    "Product",
    "ProductImage",
    "RefreshToken",
    "RESERVATION_EXPIRATION_DELAY",
    "Reservation",
    "ReservationStatus",
    "Store",
    "User",
    "UserRole",
    "ValidationStatus",
]
