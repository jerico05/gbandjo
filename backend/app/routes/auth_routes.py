"""Module 1 — authentication routes."""
from http import HTTPStatus

from flask import g
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.schemas.auth_schema import (
    EnvelopeErrorSchema,
    EnvelopeSchema,
    LoginInputSchema,
    ProfileResponseSchema,
    RefreshInputSchema,
    RegisterInputSchema,
    TokensResponseSchema,
)
from app.services.auth_service import AuthService
from app.utils.responses import ApiResponse

auth_blp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth",
    description="Module 1 : inscription, connexion JWT, rafraîchissement, déconnexion.",
)

_service = AuthService()


@auth_blp.route("/register/merchant")
class RegisterMerchant(MethodView):
    @auth_blp.arguments(RegisterInputSchema)
    @auth_blp.response(HTTPStatus.CREATED, TokensResponseSchema)
    @auth_blp.alt_response(409, schema=EnvelopeErrorSchema, description="E-mail déjà utilisé")
    @auth_blp.alt_response(422, schema=EnvelopeErrorSchema, description="Données invalides")
    @auth_blp.doc(
        summary="Inscription commerçant",
        description="Crée un compte `COMMERCANT` et renvoie les jetons access + refresh.",
        security=[],
    )
    def post(self, payload):
        return ApiResponse.created(
            data=_service.register_merchant(payload),
            message="Compte commerçant créé.",
        )


@auth_blp.route("/register/consumer")
class RegisterConsumer(MethodView):
    @auth_blp.arguments(RegisterInputSchema)
    @auth_blp.response(HTTPStatus.CREATED, TokensResponseSchema)
    @auth_blp.alt_response(409, schema=EnvelopeErrorSchema)
    @auth_blp.doc(
        summary="Inscription consommateur",
        description="Crée un compte `CONSOMMATEUR`.",
        security=[],
    )
    def post(self, payload):
        return ApiResponse.created(
            data=_service.register_consumer(payload),
            message="Compte consommateur créé.",
        )


@auth_blp.route("/login")
class Login(MethodView):
    @auth_blp.arguments(LoginInputSchema)
    @auth_blp.response(HTTPStatus.OK, TokensResponseSchema)
    @auth_blp.alt_response(401, schema=EnvelopeErrorSchema, description="Identifiants incorrects")
    @auth_blp.alt_response(403, schema=EnvelopeErrorSchema, description="Compte suspendu ou désactivé")
    @auth_blp.doc(
        summary="Connexion",
        description=(
            "Authentifie l'utilisateur. Copiez `data.access_token`, puis **Authorize** "
            "dans Swagger (`Bearer <token>`)."
        ),
        security=[],
    )
    def post(self, payload):
        tokens = _service.login(payload)
        return ApiResponse.ok(data=tokens, message="Connexion réussie.")


@auth_blp.route("/refresh")
class RefreshToken(MethodView):
    @auth_blp.arguments(RefreshInputSchema)
    @auth_blp.response(HTTPStatus.OK, TokensResponseSchema)
    @auth_blp.alt_response(401, schema=EnvelopeErrorSchema)
    @auth_blp.doc(
        summary="Rafraîchir le jeton d'accès",
        description="Échange un refresh token valide ; l'ancien est révoqué (rotation).",
        security=[],
    )
    def post(self, payload):
        tokens = _service.refresh(payload["refresh_token"])
        return ApiResponse.ok(data=tokens, message="Jeton d'accès renouvelé.")


@auth_blp.route("/logout")
class Logout(MethodView):
    @auth_blp.arguments(RefreshInputSchema)
    @auth_blp.response(HTTPStatus.OK, EnvelopeSchema)
    @auth_blp.doc(summary="Déconnexion", description="Révoque le refresh token.", security=[])
    def post(self, payload):
        _service.logout(payload["refresh_token"])
        return ApiResponse.ok(message="Déconnexion effectuée.")


@auth_blp.route("/me")
class CurrentUser(MethodView):
    @jwt_required
    @auth_blp.response(HTTPStatus.OK, ProfileResponseSchema)
    @auth_blp.alt_response(401, schema=EnvelopeErrorSchema)
    @auth_blp.doc(
        summary="Utilisateur courant (test JWT)",
        description="Route protégée par `@jwt_required`.",
        security=[{"bearerAuth": []}],
    )
    def get(self):
        return ApiResponse.ok(data={"user": _service.serialize_user(g.user)})
