"""Service métier — authentification (module 1)."""
from __future__ import annotations

import secrets
from typing import Any

from flask import current_app

from app.extensions import db
from app.middleware.auth_middleware import auth_middleware
from app.models import Consumer, Merchant
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.utils.dates import utcnow
from app.utils.responses import ApiError


class AuthService:
    def __init__(self) -> None:
        self._users = UserRepository(db.session)
        self._refresh = RefreshTokenRepository(db.session)

    def serialize_user(self, user) -> dict[str, Any]:
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

    def _issue_tokens(self, user) -> dict[str, Any]:
        expiration = utcnow() + current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]
        refresh_plain = secrets.token_urlsafe(48)
        self._refresh.create(user.id, refresh_plain, expiration)
        return {
            "access_token": auth_middleware.encode_access(user),
            "refresh_token": refresh_plain,
            "token_type": "Bearer",
            "user": self.serialize_user(user),
        }

    def _validate_password(self, password: str) -> None:
        if len(password) < 8:
            raise ApiError("Le mot de passe doit contenir au moins 8 caractères.", status=422)

    def register_merchant(self, payload: dict[str, Any]) -> dict[str, Any]:
        email = payload["email"].lower().strip()
        if self._users.email_exists(email):
            raise ApiError("Un compte existe déjà avec cette adresse e-mail.", status=409)
        self._validate_password(payload["password"])
        user = Merchant(
            last_name=payload["last_name"],
            first_name=payload["first_name"],
            email=email,
            phone=payload.get("phone"),
        )
        user.set_password(payload["password"])
        self._users.add(user)
        tokens = self._issue_tokens(user)
        db.session.commit()
        return tokens

    def register_consumer(self, payload: dict[str, Any]) -> dict[str, Any]:
        email = payload["email"].lower().strip()
        if self._users.email_exists(email):
            raise ApiError("Un compte existe déjà avec cette adresse e-mail.", status=409)
        self._validate_password(payload["password"])
        user = Consumer(
            last_name=payload["last_name"],
            first_name=payload["first_name"],
            email=email,
            phone=payload.get("phone"),
        )
        user.set_password(payload["password"])
        self._users.add(user)
        tokens = self._issue_tokens(user)
        db.session.commit()
        return tokens

    def login(self, payload: dict[str, Any]) -> dict[str, Any]:
        user = self._users.find_by_email(payload["email"])
        if user is None or not user.verify_password(payload["password"]):
            raise ApiError("E-mail ou mot de passe incorrect.", status=401)
        if not user.can_login:
            raise ApiError("Compte suspendu ou désactivé.", status=403)
        tokens = self._issue_tokens(user)
        db.session.commit()
        return tokens

    def refresh(self, refresh_token: str) -> dict[str, Any]:
        record = self._refresh.find_by_token(refresh_token)
        if record is None or not record.is_valid:
            raise ApiError("Jeton de rafraîchissement invalide ou expiré.", status=401)
        user = record.user
        if not user.can_login:
            raise ApiError("Compte suspendu ou désactivé.", status=403)
        self._refresh.revoke(record)
        tokens = self._issue_tokens(user)
        db.session.commit()
        return tokens

    def logout(self, refresh_token: str) -> None:
        record = self._refresh.find_by_token(refresh_token)
        if record is not None and record.revoked_at is None:
            self._refresh.revoke(record)
            db.session.commit()
