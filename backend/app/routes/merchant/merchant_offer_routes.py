"""Module 4 — offres commerçant."""
from http import HTTPStatus

from flask import g
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.role_middleware import require_valid_store
from app.schemas.common import EnvelopeErrorSchema, EnvelopeSchema
from app.schemas.offer_schema import (
    OfferCreateInputSchema,
    OfferMerchantListResponseSchema,
    OfferMerchantResponseSchema,
    OfferUpdateInputSchema,
)
from app.services.offer_service import OfferService
from app.utils.responses import ApiResponse

merchant_offers_blp = Blueprint(
    "merchant_offers",
    __name__,
    url_prefix="/api/merchant/offers",
    description="Module 4 : publication et gestion des offres (commerce validé, RG1).",
)

_service = OfferService()


@merchant_offers_blp.route("")
class MerchantOffers(MethodView):
    @require_valid_store
    @merchant_offers_blp.response(HTTPStatus.OK, OfferMerchantListResponseSchema)
    @merchant_offers_blp.doc(summary="Lister mes offres", security=[{"bearerAuth": []}])
    def get(self):
        return ApiResponse.ok(data={"offers": _service.list_merchant_offers(g.store)})

    @require_valid_store
    @merchant_offers_blp.arguments(OfferCreateInputSchema)
    @merchant_offers_blp.response(HTTPStatus.CREATED, OfferMerchantResponseSchema)
    @merchant_offers_blp.alt_response(403, schema=EnvelopeErrorSchema, description="Commerce non validé (RG1)")
    @merchant_offers_blp.alt_response(422, schema=EnvelopeErrorSchema, description="RG4 / RG5")
    @merchant_offers_blp.doc(summary="Publier une offre", security=[{"bearerAuth": []}])
    def post(self, payload):
        offer = _service.create_offer(g.store, payload)
        return ApiResponse.created(data={"offer": offer}, message="Offre publiée.")


@merchant_offers_blp.route("/<int:offer_id>")
class MerchantOfferDetail(MethodView):
    @require_valid_store
    @merchant_offers_blp.arguments(OfferUpdateInputSchema)
    @merchant_offers_blp.response(HTTPStatus.OK, OfferMerchantResponseSchema)
    @merchant_offers_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @merchant_offers_blp.doc(summary="Modifier une offre", security=[{"bearerAuth": []}])
    def patch(self, payload, offer_id: int):
        offer = _service.update_offer(g.store, offer_id, payload)
        return ApiResponse.ok(data={"offer": offer}, message="Offre mise à jour.")


@merchant_offers_blp.route("/<int:offer_id>/deactivate")
class MerchantOfferDeactivate(MethodView):
    @require_valid_store
    @merchant_offers_blp.response(HTTPStatus.OK, OfferMerchantResponseSchema)
    @merchant_offers_blp.doc(summary="Désactiver une offre", security=[{"bearerAuth": []}])
    def post(self, offer_id: int):
        offer = _service.deactivate_offer(g.store, offer_id)
        return ApiResponse.ok(data={"offer": offer}, message="Offre désactivée.")


@merchant_offers_blp.route("/<int:offer_id>/withdraw")
class MerchantOfferWithdraw(MethodView):
    @require_valid_store
    @merchant_offers_blp.response(HTTPStatus.OK, OfferMerchantResponseSchema)
    @merchant_offers_blp.doc(summary="Retirer une offre", security=[{"bearerAuth": []}])
    def post(self, offer_id: int):
        offer = _service.withdraw_offer(g.store, offer_id)
        return ApiResponse.ok(data={"offer": offer}, message="Offre retirée.")
