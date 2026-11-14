"""Service — notifications (module 6) et émission RG16."""
from __future__ import annotations

from typing import Any

from app.extensions import db
from app.models import Notification
from app.repositories.notification_repository import NotificationRepository
from app.utils.pagination import normalize_page_params, pagination_meta
from app.utils.responses import ApiError


class NotificationService:
    def __init__(self) -> None:
        self._notifications = NotificationRepository(db.session)

    @staticmethod
    def serialize(notification: Notification) -> dict[str, Any]:
        return {
            "id": notification.id,
            "type": notification.type,
            "message": notification.message,
            "is_read": notification.is_read,
            "reservation_id": notification.reservation_id,
            "created_at": notification.created_at.isoformat(),
        }

    def notify_reservation(
        self,
        *,
        recipient_id: int,
        reservation_id: int,
        type_code: str,
        message: str,
    ) -> None:
        self._notifications.add(
            Notification(
                recipient_id=recipient_id,
                reservation_id=reservation_id,
                type=type_code,
                message=message,
            )
        )

    def list_mine(
        self,
        user,
        *,
        page: int | None,
        per_page: int | None,
        unread_only: bool,
    ) -> dict[str, Any]:
        page, per_page = normalize_page_params(page, per_page)
        total = self._notifications.count_for_recipient(user.id, unread_only=unread_only)
        items = self._notifications.list_for_recipient(
            user.id, page=page, per_page=per_page, unread_only=unread_only
        )
        return {
            "notifications": [self.serialize(n) for n in items],
            "pagination": pagination_meta(total, page, per_page),
            "unread_count": self._notifications.count_for_recipient(user.id, unread_only=True),
        }

    def mark_read(self, user, notification_id: int) -> dict[str, Any]:
        notification = self._notifications.find_for_recipient(notification_id, user.id)
        if notification is None:
            raise ApiError("Notification introuvable.", status=404)
        if not notification.is_read:
            notification.is_read = True
            db.session.commit()
        return self.serialize(notification)

    def mark_all_read(self, user) -> dict[str, Any]:
        updated = self._notifications.mark_all_read(user.id)
        db.session.commit()
        return {"updated_count": updated}
