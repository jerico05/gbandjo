"""Service métier — profil utilisateur (module 2)."""
from __future__ import annotations

from typing import Any

from app.extensions import db
from app.models import User
from app.repositories.user_repository import UserRepository
from app.utils.responses import ApiError


class UserService:
    def __init__(self) -> None:
        self._repo = UserRepository(db.session)

    @staticmethod
    def serialize(user: User) -> dict[str, Any]:
        return {
            "id": user.id,
            "last_name": user.last_name,
            "first_name": user.first_name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role.value,
            "account_status": user.account_status.value,
            "created_at": user.created_at.isoformat(),
        }

    def get_profile(self, user: User) -> dict[str, Any]:
        return self.serialize(user)

    def update_profile(self, user: User, payload: dict[str, Any]) -> dict[str, Any]:
        if not payload:
            raise ApiError("Aucune modification fournie.", status=422)

        allowed = ("last_name", "first_name", "phone", "email")
        for key, value in payload.items():
            if key not in allowed or value is None:
                continue
            if key == "email":
                email = value.lower().strip()
                if self._repo.email_taken_by_other(email, user.id):
                    raise ApiError("Un compte utilise déjà cette adresse e-mail.", status=409)
                user.email = email
            else:
                setattr(user, key, value)

        self._repo.commit()
        return self.serialize(user)

    def change_password(self, user: User, old_password: str, new_password: str) -> None:
        if not user.verify_password(old_password):
            raise ApiError("Ancien mot de passe incorrect.", status=401)
        if len(new_password) < 8:
            raise ApiError("Le nouveau mot de passe doit contenir au moins 8 caractères.", status=422)
        if old_password == new_password:
            raise ApiError("Le nouveau mot de passe doit être différent de l'ancien.", status=422)
        user.set_password(new_password)
        self._repo.commit()
