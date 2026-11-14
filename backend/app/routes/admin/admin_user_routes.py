"""Module 7 — gestion des utilisateurs."""
from http import HTTPStatus

from flask import g, request
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.middleware.role_middleware import require_role
from app.models.enums import UserRole
from app.schemas.admin_schema import (
    AccountStatusInputSchema,
    AdminUserListResponseSchema,
    AdminUserResponseSchema,
)
from app.schemas.common import EnvelopeErrorSchema
from app.services.admin_user_service import AdminUserService
from app.utils.responses import ApiResponse

admin_users_blp = Blueprint(
    "admin_users",
    __name__,
    url_prefix="/api/admin/users",
    description="Module 7 : lister et gérer les comptes utilisateurs.",
)

_service = AdminUserService()


@admin_users_blp.route("")
class AdminUserList(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_users_blp.response(HTTPStatus.OK, AdminUserListResponseSchema)
    @admin_users_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @admin_users_blp.doc(
        summary="Lister les utilisateurs",
        description="Filtres : `role`, `account_status`, `q` (e-mail, nom), `page`, `per_page`.",
        security=[{"bearerAuth": []}],
    )
    def get(self):
        data = _service.list_users(
            role=request.args.get("role"),
            account_status=request.args.get("account_status"),
            search=request.args.get("q"),
            page=request.args.get("page", type=int),
            per_page=request.args.get("per_page", type=int),
        )
        return ApiResponse.ok(data=data)


@admin_users_blp.route("/<int:user_id>/status")
class AdminUserStatus(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_users_blp.arguments(AccountStatusInputSchema)
    @admin_users_blp.response(HTTPStatus.OK, AdminUserResponseSchema)
    @admin_users_blp.alt_response(404, schema=EnvelopeErrorSchema)
    @admin_users_blp.alt_response(409, schema=EnvelopeErrorSchema)
    @admin_users_blp.doc(
        summary="Activer, suspendre ou désactiver un compte",
        security=[{"bearerAuth": []}],
    )
    def patch(self, payload, user_id: int):
        user = _service.update_account_status(g.user, user_id, payload["account_status"])
        return ApiResponse.ok(data={"user": user}, message="Statut du compte mis à jour.")
