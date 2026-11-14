"""Module 7 — modération des offres."""
from http import HTTPStatus

from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.middleware.role_middleware import require_role
from app.models.enums import UserRole
from app.schemas.admin_schema import (
    AdminOfferListResponseSchema,
    AdminOfferResponseSchema,
)
from app.schemas.common import EnvelopeErrorSchema
from app.services.admin_offer_service import AdminOfferService
from app.utils.responses import ApiResponse

admin_offers_blp = Blueprint(
    "admin_offers",
    __name__,
    url_prefix="/api/admin/offers",
    description="Module 7 : lister, désactiver ou retirer des offres.",
)

_service = AdminOfferService()


@admin_offers_blp.route("")
class AdminOfferList(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_offers_blp.response(HTTPStatus.OK, AdminOfferListResponseSchema)
    @admin_offers_blp.doc(
        summary="Lister les offres",
        description="Filtre `status` : ACTIVE, DESACTIVEE, RETIREE.",
        security=[{"bearerAuth": []}],
    )
    def get(self):
        data = _service.list_offers(
            status=request.args.get("status"),
            page=request.args.get("page", type=int),
            per_page=request.args.get("per_page", type=int),
        )
        return ApiResponse.ok(data=data)


@admin_offers_blp.route("/<int:offer_id>/deactivate")
class AdminOfferDeactivate(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_offers_blp.response(HTTPStatus.OK, AdminOfferResponseSchema)
    @admin_offers_blp.doc(summary="Désactiver une offre", security=[{"bearerAuth": []}])
    def post(self, offer_id: int):
        offer = _service.deactivate(offer_id)
        return ApiResponse.ok(data={"offer": offer}, message="Offre désactivée.")


@admin_offers_blp.route("/<int:offer_id>/withdraw")
class AdminOfferWithdraw(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_offers_blp.response(HTTPStatus.OK, AdminOfferResponseSchema)
    @admin_offers_blp.doc(summary="Retirer une offre", security=[{"bearerAuth": []}])
    def post(self, offer_id: int):
        offer = _service.withdraw(offer_id)
        return ApiResponse.ok(data={"offer": offer}, message="Offre retirée.")
