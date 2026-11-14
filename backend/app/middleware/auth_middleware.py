"""JWT : encodage, décodage et décorateur ``jwt_required``."""
from __future__ import annotations

from functools import wraps
from typing import Callable, TypeVar

import jwt
from flask import current_app, g, request
from jwt import InvalidTokenError

from app.utils.responses import ApiError

F = TypeVar("F", bound=Callable[..., object])


class AuthMiddleware:
    def init_app(self, application) -> None:
        self._ready = True

    @staticmethod
    def extract_bearer() -> str | None:
        header = (request.headers.get("Authorization") or "").strip()
        if not header:
            return None
        if len(header) >= 2 and header[0] == header[-1] and header[0] in {'"', "'"}:
            header = header[1:-1].strip()
        # Swagger envoie parfois « Bearer Bearer <jwt> » si le jeton est déjà préfixé.
        while header.lower().startswith("bearer "):
            header = header[7:].lstrip()
        return header or None

    def decode_access(self, token: str) -> dict:
        try:
            return jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=[current_app.config["JWT_ALGORITHM"]],
            )
        except InvalidTokenError as err:
            raise ApiError("Jeton invalide ou expiré.", status=401) from err

    def encode_access(self, user) -> str:
        from app.utils.dates import utcnow

        expiration = utcnow() + current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]
        payload = {
            "sub": str(user.id),
            "role": user.role.value,
            "type": "access",
            "exp": expiration,
            "iat": utcnow(),
        }
        return jwt.encode(
            payload,
            current_app.config["SECRET_KEY"],
            algorithm=current_app.config["JWT_ALGORITHM"],
        )

    def load_user(self):
        from app.extensions import db
        from app.models import User

        token = self.extract_bearer()
        if not token:
            raise ApiError(
                "Authentification requise. En-tête attendu : Authorization: Bearer <access_token>.",
                status=401,
            )
        payload = self.decode_access(token)
        if payload.get("type") != "access":
            raise ApiError("Type de jeton invalide.", status=401)
        user_id = payload["sub"]
        if isinstance(user_id, str):
            user_id = int(user_id)
        user = db.session.get(User, user_id)
        if user is None:
            raise ApiError("Utilisateur introuvable.", status=401)
        if not user.can_login:
            raise ApiError("Compte suspendu ou désactivé.", status=403)
        return user

    def jwt_required(self, handler: F) -> F:
        @wraps(handler)
        def wrapper(*args, **kwargs):
            g.user = self.load_user()
            return handler(*args, **kwargs)

        return wrapper  # type: ignore[return-value]


auth_middleware = AuthMiddleware()
jwt_required = auth_middleware.jwt_required
