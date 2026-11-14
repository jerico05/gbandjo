"""Module 3 — commerce du commerçant connecté."""
from http import HTTPStatus

from flask import g
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.schemas.common import EnvelopeErrorSchema
from app.schemas.store_schema import (
    StoreCreateInputSchema,
    StoreResponseSchema,
    StoreUpdateInputSchema,
)
from app.services.store_service import StoreService
from app.utils.responses import ApiResponse

stores_blp = Blueprint(
    "stores",
    __name__,
    url_prefix="/api/stores",
    description="Module 3 : enregistrer, consulter et modifier son commerce (commerçant).",
)

_service = StoreService()


@stores_blp.route("/me")
class MyStore(MethodView):
    @jwt_required
    @stores_blp.response(HTTPStatus.OK, StoreResponseSchema)
    @stores_blp.alt_response(404, schema=EnvelopeErrorSchema, description="Aucun commerce")
    @stores_blp.alt_response(403, schema=EnvelopeErrorSchema)
    @stores_blp.doc(
        summary="Consulter mon commerce",
        description="Retourne le commerce lié au compte commerçant connecté.",
        security=[{"bearerAuth": []}],
    )
    def get(self):
        return ApiResponse.ok(data={"store": _service.get_my_store(g.user)})

    @jwt_required
    @stores_blp.arguments(StoreCreateInputSchema)
    @stores_blp.response(HTTPStatus.CREATED, StoreResponseSchema)
    @stores_blp.alt_response(409, schema=EnvelopeErrorSchema, description="Un commerce existe déjà (RG1)")
    @stores_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @stores_blp.alt_response(403, schema=EnvelopeErrorSchema)
    @stores_blp.doc(
        summary="Enregistrer mon commerce",
        description=(
            "Crée une demande de validation (`EN_ATTENTE`). Un seul commerce par commerçant (RG1)."
        ),
        security=[{"bearerAuth": []}],
    )
    def post(self, payload):
        store = _service.create_store(g.user, payload)
        return ApiResponse.created(
            data={"store": store},
            message="Commerce enregistré ; en attente de validation.",
        )

    @jwt_required
    @stores_blp.arguments(StoreUpdateInputSchema)
    @stores_blp.response(HTTPStatus.OK, StoreResponseSchema)
    @stores_blp.alt_response(404, schema=EnvelopeErrorSchema)
    @stores_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @stores_blp.doc(
        summary="Modifier mon commerce",
        description=(
            "Met à jour les champs fournis. Après un rejet, une modification remet le statut à `EN_ATTENTE`."
        ),
        security=[{"bearerAuth": []}],
    )
    def patch(self, payload):
        store = _service.update_store(g.user, payload)
        return ApiResponse.ok(data={"store": store}, message="Commerce mis à jour.")
