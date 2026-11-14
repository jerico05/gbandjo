"""Contrôle d'accès par rôle et commerce validé."""
from __future__ import annotations

from functools import wraps
from typing import Callable, TypeVar

from flask import g

from app.extensions import db
from app.middleware.auth_middleware import auth_middleware
from app.models.enums import UserRole, ValidationStatus
from app.repositories.store_repository import StoreRepository
from app.utils.responses import ApiError

F = TypeVar("F", bound=Callable[..., object])


class RoleMiddleware:
    def require_role(self, *roles: UserRole):
        def decorator(handler: F) -> F:
            @wraps(handler)
            @auth_middleware.jwt_required
            def wrapper(*args, **kwargs):
                if g.user.role not in roles:
                    raise ApiError("Accès refusé pour ce rôle.", status=403)
                return handler(*args, **kwargs)

            return wrapper  # type: ignore[return-value]

        return decorator

    def require_valid_store(self, handler: F) -> F:
        @wraps(handler)
        @self.require_role(UserRole.COMMERCANT)
        def wrapper(*args, **kwargs):
            store = getattr(g.user, "store", None)
            if store is None:
                store = StoreRepository(db.session).find_by_owner_id(g.user.id)
            if store is None or store.validation_status != ValidationStatus.VALIDE:
                raise ApiError("Commerce non validé.", status=403)
            g.store = store
            return handler(*args, **kwargs)

        return wrapper  # type: ignore[return-value]


role_middleware = RoleMiddleware()
require_role = role_middleware.require_role
require_valid_store = role_middleware.require_valid_store
