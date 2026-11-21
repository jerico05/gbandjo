"""Module 3 — validation des commerces (administrateur)."""
from http import HTTPStatus

from flask import g, request
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.middleware.role_middleware import require_role
from app.models.enums import UserRole
from app.schemas.common import EnvelopeErrorSchema
from app.schemas.admin_schema import AdminStoreDetailResponseSchema
from app.schemas.store_schema import (
    StoreListResponseSchema,
    StoreRejectInputSchema,
    StoreResponseSchema,
)
from app.services.store_service import StoreService
from app.utils.responses import ApiResponse

admin_stores_blp = Blueprint(
    "admin_stores",
    __name__,
    url_prefix="/api/admin/stores",
    description="Module 3 : lister, valider ou rejeter les demandes de commerce.",
)

_service = StoreService()


@admin_stores_blp.route("")
class AdminStoreList(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_stores_blp.response(HTTPStatus.OK, StoreListResponseSchema)
    @admin_stores_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @admin_stores_blp.doc(
        summary="Lister les commerces",
        description="Filtre optionnel : `validation_status` (`EN_ATTENTE`, `VALIDE`, `REJETE`).",
        security=[{"bearerAuth": []}],
    )
    def get(self):
        status = request.args.get("validation_status")
        stores = _service.list_stores(g.user, status)
        return ApiResponse.ok(data={"stores": stores})


@admin_stores_blp.route("/<int:store_id>")
class AdminStoreDetail(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_stores_blp.response(HTTPStatus.OK, AdminStoreDetailResponseSchema)
    @admin_stores_blp.alt_response(404, schema=EnvelopeErrorSchema)
    @admin_stores_blp.doc(
        summary="Fiche commerce : propriétaire, produits et offres",
        security=[{"bearerAuth": []}],
    )
    def get(self, store_id: int):
        payload = _service.get_store_detail_admin(g.user, store_id)
        return ApiResponse.ok(data=payload)


@admin_stores_blp.route("/<int:store_id>/validate")
class AdminStoreValidate(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_stores_blp.response(HTTPStatus.OK, StoreResponseSchema)
    @admin_stores_blp.alt_response(404, schema=EnvelopeErrorSchema)
    @admin_stores_blp.alt_response(409, schema=EnvelopeErrorSchema)
    @admin_stores_blp.doc(
        summary="Valider un commerce",
        security=[{"bearerAuth": []}],
    )
    def post(self, store_id: int):
        store = _service.validate_store(g.user, store_id)
        return ApiResponse.ok(data={"store": store}, message="Commerce validé.")


@admin_stores_blp.route("/<int:store_id>/reject")
class AdminStoreReject(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_stores_blp.arguments(StoreRejectInputSchema)
    @admin_stores_blp.response(HTTPStatus.OK, StoreResponseSchema)
    @admin_stores_blp.alt_response(404, schema=EnvelopeErrorSchema)
    @admin_stores_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @admin_stores_blp.doc(
        summary="Rejeter un commerce",
        description="Le motif (`rejection_reason`) est obligatoire.",
        security=[{"bearerAuth": []}],
    )
    def post(self, payload, store_id: int):
        store = _service.reject_store(g.user, store_id, payload["rejection_reason"])
        return ApiResponse.ok(data={"store": store}, message="Commerce rejeté.")
