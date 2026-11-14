"""Administration — utilisateurs (module 7)."""
from __future__ import annotations

from typing import Any

from app.extensions import db
from app.models.enums import AccountStatus, UserRole
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.utils.pagination import normalize_page_params, pagination_meta
from app.utils.responses import ApiError


class AdminUserService:
    def __init__(self) -> None:
        self._users = UserRepository(db.session)
        self._auth = AuthService()

    def _parse_role(self, value: str | None) -> UserRole | None:
        if not value:
            return None
        try:
            return UserRole(value)
        except ValueError as err:
            raise ApiError("Rôle inconnu.", status=422) from err

    def _parse_status(self, value: str | None) -> AccountStatus | None:
        if not value:
            return None
        try:
            return AccountStatus(value)
        except ValueError as err:
            raise ApiError("Statut de compte inconnu.", status=422) from err

    def list_users(
        self,
        *,
        role: str | None,
        account_status: str | None,
        search: str | None,
        page: int | None,
        per_page: int | None,
    ) -> dict[str, Any]:
        page, per_page = normalize_page_params(page, per_page, default=20)
        role_enum = self._parse_role(role)
        status_enum = self._parse_status(account_status)
        total = self._users.count_filtered(role=role_enum, account_status=status_enum, search=search)
        users = self._users.list_filtered(
            role=role_enum,
            account_status=status_enum,
            search=search,
            page=page,
            per_page=per_page,
        )
        return {
            "users": [self._auth.serialize_user(u) for u in users],
            "pagination": pagination_meta(total, page, per_page),
        }

    def update_account_status(self, admin, user_id: int, new_status: str) -> dict[str, Any]:
        if admin.id == user_id:
            raise ApiError("Vous ne pouvez pas modifier votre propre compte.", status=409)
        status = self._parse_status(new_status)
        if status is None:
            raise ApiError("Statut de compte requis.", status=422)
        user = self._users.find_by_id(user_id)
        if user is None:
            raise ApiError("Utilisateur introuvable.", status=404)
        user.account_status = status
        db.session.commit()
        return self._auth.serialize_user(user)
