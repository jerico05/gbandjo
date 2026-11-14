"""Routes internes (cron) — module 5."""
from http import HTTPStatus

from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint

from app.schemas.common import EnvelopeErrorSchema
from app.schemas.reservation_schema import ExpireReservationsResponseSchema
from app.services.reservation_service import ReservationService
from app.utils.responses import ApiResponse

internal_blp = Blueprint(
    "internal",
    __name__,
    url_prefix="/internal",
    description="Tâches internes (expiration des réservations).",
)


@internal_blp.route("/expirer-reservations")
class ExpireReservations(MethodView):
    @internal_blp.response(HTTPStatus.OK, ExpireReservationsResponseSchema)
    @internal_blp.alt_response(403, schema=EnvelopeErrorSchema)
    @internal_blp.doc(
        summary="Expirer les réservations en attente",
        description="Header optionnel `X-Cron-Key` si `INTERNAL_CRON_KEY` est défini.",
        security=[],
    )
    def post(self):
        key = request.headers.get("X-Cron-Key")
        result = ReservationService().run_internal_expiration(key)
        return ApiResponse.ok(data=result, message="Traitement terminé.")
