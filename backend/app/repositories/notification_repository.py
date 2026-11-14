"""Accès données — Notification."""
from __future__ import annotations

from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app.models import Notification


class NotificationRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, notification: Notification) -> Notification:
        self._session.add(notification)
        self._session.flush()
        return notification

    def count_for_recipient(self, recipient_id: int, *, unread_only: bool = False) -> int:
        statement = select(func.count()).select_from(Notification).where(Notification.recipient_id == recipient_id)
        if unread_only:
            statement = statement.where(Notification.is_read.is_(False))
        return self._session.scalar(statement) or 0

    def list_for_recipient(
        self,
        recipient_id: int,
        *,
        page: int,
        per_page: int,
        unread_only: bool = False,
    ) -> list[Notification]:
        statement = (
            select(Notification)
            .where(Notification.recipient_id == recipient_id)
            .order_by(Notification.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        if unread_only:
            statement = statement.where(Notification.is_read.is_(False))
        return list(self._session.scalars(statement))

    def find_for_recipient(self, notification_id: int, recipient_id: int) -> Notification | None:
        return self._session.scalar(
            select(Notification).where(
                Notification.id == notification_id,
                Notification.recipient_id == recipient_id,
            )
        )

    def mark_all_read(self, recipient_id: int) -> int:
        result = self._session.execute(
            update(Notification)
            .where(Notification.recipient_id == recipient_id, Notification.is_read.is_(False))
            .values(is_read=True)
        )
        return result.rowcount or 0
