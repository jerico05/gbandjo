"""Module 5 — réservations consommateur."""
from http import HTTPStatus

from flask import g
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.role_middleware import require_role
from app.models.enums import UserRole
from app.schemas.common import EnvelopeErrorSchema, EnvelopeSchema
from app.schemas.reservation_schema import (
    ReservationCreateInputSchema,
    ReservationListResponseSchema,
    ReservationResponseSchema,
)
from app.services.reservation_service import ReservationService
from app.utils.responses import ApiResponse

consumer_reservations_blp = Blueprint(
    "consumer_reservations",
    __name__,
    url_prefix="/api/consumer/reservations",
    description="Module 5 : créer, lister et annuler ses réservations.",
)

_service = ReservationService()


@consumer_reservations_blp.route("")
class ConsumerReservations(MethodView):
    @require_role(UserRole.CONSOMMATEUR)
    @consumer_reservations_blp.response(HTTPStatus.OK, ReservationListResponseSchema)
    @consumer_reservations_blp.doc(summary="Lister mes réservations", security=[{"bearerAuth": []}])
    def get(self):
        return ApiResponse.ok(data={"reservations": _service.list_consumer_reservations(g.user)})

    @require_role(UserRole.CONSOMMATEUR)
    @consumer_reservations_blp.arguments(ReservationCreateInputSchema)
    @consumer_reservations_blp.response(HTTPStatus.CREATED, ReservationResponseSchema)
    @consumer_reservations_blp.alt_response(409, schema=EnvelopeErrorSchema)
    @consumer_reservations_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @consumer_reservations_blp.doc(summary="Créer une réservation", security=[{"bearerAuth": []}])
    def post(self, payload):
        reservation = _service.create_reservation(g.user, payload)
        return ApiResponse.created(data={"reservation": reservation}, message="Réservation enregistrée.")


@consumer_reservations_blp.route("/<int:reservation_id>/cancel")
class ConsumerReservationCancel(MethodView):
    @require_role(UserRole.CONSOMMATEUR)
    @consumer_reservations_blp.response(HTTPStatus.OK, ReservationResponseSchema)
    @consumer_reservations_blp.alt_response(409, schema=EnvelopeErrorSchema)
    @consumer_reservations_blp.doc(summary="Annuler ma réservation (EN_ATTENTE)", security=[{"bearerAuth": []}])
    def post(self, reservation_id: int):
        reservation = _service.cancel_by_consumer(g.user, reservation_id)
        return ApiResponse.ok(data={"reservation": reservation}, message="Réservation annulée.")
