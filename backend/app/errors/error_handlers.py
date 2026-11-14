"""Gestion centralisée des erreurs HTTP."""
from http import HTTPStatus

from flask import Flask
from marshmallow import ValidationError
from werkzeug.exceptions import HTTPException

from app.utils.responses import ApiError, ApiResponse


class ErrorHandlers:
    @classmethod
    def register(cls, application: Flask) -> None:
        @application.errorhandler(ApiError)
        def handle_api_error(exc: ApiError):
            return ApiResponse.ok(message=exc.message, errors=exc.errors, status=exc.status)

        @application.errorhandler(ValidationError)
        def handle_validation(exc: ValidationError):
            return ApiResponse.ok(
                message="Données invalides.",
                errors=exc.messages,
                status=HTTPStatus.UNPROCESSABLE_ENTITY,
            )

        @application.errorhandler(HTTPException)
        def handle_http(exc: HTTPException):
            return ApiResponse.ok(
                message=exc.description or exc.name,
                status=exc.code or HTTPStatus.INTERNAL_SERVER_ERROR,
            )

        @application.errorhandler(Exception)
        def handle_unexpected(exc: Exception):
            if application.config.get("TESTING") or application.debug:
                raise exc
            application.logger.exception("Erreur serveur")
            return ApiResponse.ok(message="Erreur interne du serveur.", status=500)
