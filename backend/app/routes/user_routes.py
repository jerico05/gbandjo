"""Module 2 — user profile routes."""
from http import HTTPStatus

from flask import g
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.schemas.auth_schema import EnvelopeErrorSchema, EnvelopeSchema
from app.schemas.user_schema import (
    PasswordChangeInputSchema,
    ProfileResponseSchema,
    ProfileUpdateInputSchema,
)
from app.services.user_service import UserService
from app.utils.responses import ApiResponse

users_blp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users",
    description="Module 2 : consulter et modifier son profil, changer son mot de passe.",
)

_service = UserService()


@users_blp.route("/profile")
class Profile(MethodView):
    @jwt_required
    @users_blp.response(HTTPStatus.OK, ProfileResponseSchema)
    @users_blp.alt_response(401, schema=EnvelopeErrorSchema)
    @users_blp.doc(
        summary="Consulter mon profil",
        description="Retourne les informations du compte connecté (tous rôles).",
        security=[{"bearerAuth": []}],
    )
    def get(self):
        return ApiResponse.ok(data={"user": _service.get_profile(g.user)})

    @jwt_required
    @users_blp.arguments(ProfileUpdateInputSchema)
    @users_blp.response(HTTPStatus.OK, ProfileResponseSchema)
    @users_blp.alt_response(409, schema=EnvelopeErrorSchema, description="E-mail déjà utilisé")
    @users_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @users_blp.doc(
        summary="Modifier mon profil",
        description=(
            "Met à jour partiellement `last_name`, `first_name`, `phone` ou `email`. "
            "Seuls les champs envoyés sont modifiés."
        ),
        security=[{"bearerAuth": []}],
    )
    def patch(self, payload):
        user = _service.update_profile(g.user, payload)
        return ApiResponse.ok(data={"user": user}, message="Profil mis à jour.")


@users_blp.route("/password")
class Password(MethodView):
    @jwt_required
    @users_blp.arguments(PasswordChangeInputSchema)
    @users_blp.response(HTTPStatus.OK, EnvelopeSchema)
    @users_blp.alt_response(401, schema=EnvelopeErrorSchema, description="Ancien mot de passe incorrect")
    @users_blp.alt_response(422, schema=EnvelopeErrorSchema)
    @users_blp.doc(
        summary="Modifier mon mot de passe",
        description="Vérifie l'ancien mot de passe avant d'enregistrer le nouveau (min. 8 caractères).",
        security=[{"bearerAuth": []}],
    )
    def put(self, payload):
        _service.change_password(g.user, payload["old_password"], payload["new_password"])
        return ApiResponse.ok(message="Mot de passe modifié.")
