"""Module 4 — offres publiques (consommateur)."""
from http import HTTPStatus

from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint

from app.schemas.common import EnvelopeErrorSchema
from app.schemas.offer_schema import OfferDetailResponseSchema, OfferListResponseSchema
from app.services.offer_service import OfferService
from app.utils.responses import ApiResponse

offers_blp = Blueprint(
    "offers",
    __name__,
    url_prefix="/api/offers",
    description="Module 4 : catalogue d'offres actives, recherche et tri par distance.",
)

_service = OfferService()


def _parse_query_args() -> dict:
    args = request.args
    category_id = args.get("category_id", type=int)
    return {
        "category_id": category_id,
        "q": args.get("q"),
        "min_price": args.get("min_price"),
        "max_price": args.get("max_price"),
        "min_discount": args.get("min_discount"),
        "latitude": args.get("latitude", type=float),
        "longitude": args.get("longitude", type=float),
        "sort": args.get("sort"),
    }


@offers_blp.route("")
class PublicOfferList(MethodView):
    @offers_blp.response(HTTPStatus.OK, OfferListResponseSchema)
    @offers_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @offers_blp.doc(
        summary="Lister les offres actives",
        description=(
            "Filtres : `category_id`, `q`, `min_price`, `max_price`, `min_discount`. "
            "Tri distance : `sort=distance` avec `latitude` et `longitude`."
        ),
        security=[],
    )
    def get(self):
        offers = _service.list_public_offers(_parse_query_args())
        return ApiResponse.ok(data={"offers": offers})


@offers_blp.route("/<int:offer_id>")
class PublicOfferDetail(MethodView):
    @offers_blp.response(HTTPStatus.OK, OfferDetailResponseSchema)
    @offers_blp.alt_response(404, schema=EnvelopeErrorSchema)
    @offers_blp.doc(
        summary="Détail d'une offre",
        description="Désactive automatiquement l'offre si elle est expirée ou épuisée.",
        security=[],
    )
    def get(self, offer_id: int):
        offer = _service.get_public_offer(offer_id)
        return ApiResponse.ok(data={"offer": offer})
