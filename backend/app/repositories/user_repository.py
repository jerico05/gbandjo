"""Accès données — User."""
from __future__ import annotations

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import User
from app.models.enums import AccountStatus, UserRole


class UserRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def find_by_id(self, user_id: int) -> User | None:
        return self._session.get(User, user_id)

    def email_exists(self, email: str) -> bool:
        return self._session.scalar(select(User.id).where(User.email == email.lower())) is not None

    def email_taken_by_other(self, email: str, user_id: int) -> bool:
        other = self._session.scalar(
            select(User.id).where(User.email == email.lower().strip(), User.id != user_id)
        )
        return other is not None

    def find_by_email(self, email: str) -> User | None:
        return self._session.scalar(select(User).where(User.email == email.lower().strip()))

    def list_filtered(
        self,
        *,
        role: UserRole | None = None,
        account_status: AccountStatus | None = None,
        search: str | None = None,
        page: int,
        per_page: int,
    ) -> list[User]:
        statement = select(User).order_by(User.created_at.desc())
        if role is not None:
            statement = statement.where(User.role == role)
        if account_status is not None:
            statement = statement.where(User.account_status == account_status)
        if search:
            pattern = f"%{search.strip()}%"
            statement = statement.where(
                or_(User.email.ilike(pattern), User.last_name.ilike(pattern), User.first_name.ilike(pattern))
            )
        statement = statement.offset((page - 1) * per_page).limit(per_page)
        return list(self._session.scalars(statement))

    def count_filtered(
        self,
        *,
        role: UserRole | None = None,
        account_status: AccountStatus | None = None,
        search: str | None = None,
    ) -> int:
        statement = select(func.count()).select_from(User)
        if role is not None:
            statement = statement.where(User.role == role)
        if account_status is not None:
            statement = statement.where(User.account_status == account_status)
        if search:
            pattern = f"%{search.strip()}%"
            statement = statement.where(
                or_(User.email.ilike(pattern), User.last_name.ilike(pattern), User.first_name.ilike(pattern))
            )
        return self._session.scalar(statement) or 0

    def count_by_status(self) -> dict[str, int]:
        rows = self._session.execute(
            select(User.account_status, func.count()).group_by(User.account_status)
        ).all()
        return {status.value: count for status, count in rows}

    def count_by_role(self) -> dict[str, int]:
        rows = self._session.execute(select(User.role, func.count()).group_by(User.role)).all()
        return {role.value: count for role, count in rows}

    def add(self, user: User) -> User:
        self._session.add(user)
        self._session.flush()
        return user

    def commit(self) -> None:
        self._session.commit()
