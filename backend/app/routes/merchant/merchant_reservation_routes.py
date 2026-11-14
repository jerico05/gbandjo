"""Module 5 — réservations côté commerçant."""
from http import HTTPStatus

from flask import g
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.role_middleware import require_valid_store
from app.schemas.common import EnvelopeErrorSchema
from app.schemas.reservation_schema import (
    ReservationListResponseSchema,
    ReservationRejectInputSchema,
    ReservationResponseSchema,
)
from app.services.reservation_service import ReservationService
from app.utils.responses import ApiResponse

merchant_reservations_blp = Blueprint(
    "merchant_reservations",
    __name__,
    url_prefix="/api/merchant/reservations",
    description="Module 5 : confirmer, rejeter, retirer ou annuler des réservations.",
)

_service = ReservationService()


@merchant_reservations_blp.route("")
class MerchantReservations(MethodView):
    @require_valid_store
    @merchant_reservations_blp.response(HTTPStatus.OK, ReservationListResponseSchema)
    @merchant_reservations_blp.doc(summary="Lister les réservations de mon commerce", security=[{"bearerAuth": []}])
    def get(self):
        return ApiResponse.ok(data={"reservations": _service.list_merchant_reservations(g.store)})


@merchant_reservations_blp.route("/<int:reservation_id>/confirm")
class MerchantReservationConfirm(MethodView):
    @require_valid_store
    @merchant_reservations_blp.response(HTTPStatus.OK, ReservationResponseSchema)
    @merchant_reservations_blp.alt_response(409, schema=EnvelopeErrorSchema, description="Stock insuffisant (RG13)")
    @merchant_reservations_blp.doc(summary="Confirmer (verrouillage stock)", security=[{"bearerAuth": []}])
    def post(self, reservation_id: int):
        reservation = _service.confirm(g.store, reservation_id)
        return ApiResponse.ok(data={"reservation": reservation}, message="Réservation confirmée.")


@merchant_reservations_blp.route("/<int:reservation_id>/reject")
class MerchantReservationReject(MethodView):
    @require_valid_store
    @merchant_reservations_blp.arguments(ReservationRejectInputSchema)
    @merchant_reservations_blp.response(HTTPStatus.OK, ReservationResponseSchema)
    @merchant_reservations_blp.doc(summary="Rejeter une réservation", security=[{"bearerAuth": []}])
    def post(self, payload, reservation_id: int):
        reservation = _service.reject(g.store, reservation_id, payload.get("reason"))
        return ApiResponse.ok(data={"reservation": reservation}, message="Réservation rejetée.")


@merchant_reservations_blp.route("/<int:reservation_id>/picked-up")
class MerchantReservationPickedUp(MethodView):
    @require_valid_store
    @merchant_reservations_blp.response(HTTPStatus.OK, ReservationResponseSchema)
    @merchant_reservations_blp.doc(summary="Marquer comme retirée", security=[{"bearerAuth": []}])
    def post(self, reservation_id: int):
        reservation = _service.mark_picked_up(g.store, reservation_id)
        return ApiResponse.ok(data={"reservation": reservation}, message="Retrait enregistré.")


@merchant_reservations_blp.route("/<int:reservation_id>/cancel")
class MerchantReservationCancel(MethodView):
    @require_valid_store
    @merchant_reservations_blp.arguments(ReservationRejectInputSchema)
    @merchant_reservations_blp.response(HTTPStatus.OK, ReservationResponseSchema)
    @merchant_reservations_blp.doc(summary="Annuler après confirmation", security=[{"bearerAuth": []}])
    def post(self, payload, reservation_id: int):
        reservation = _service.cancel_by_merchant(g.store, reservation_id, payload.get("reason"))
        return ApiResponse.ok(data={"reservation": reservation}, message="Réservation annulée.")
