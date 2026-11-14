"""Santé de l'API et vérification de la connexion PostgreSQL."""
from http import HTTPStatus

from flask.views import MethodView
from flask_smorest import Blueprint

from app.extensions import db
from app.schemas.auth_schema import HealthResponseSchema
from app.utils.responses import ApiResponse

system_blp = Blueprint(
    "system",
    __name__,
    url_prefix="/api",
    description="Santé du service et test de connexion à la base Neon/PostgreSQL.",
)


@system_blp.route("/health")
class HealthController(MethodView):
    @system_blp.response(HTTPStatus.OK, HealthResponseSchema)
    @system_blp.doc(
        summary="Santé + connexion base de données",
        description=(
            "Exécute `SELECT 1` sur PostgreSQL.\n\n"
            "- `data.database` = **ok** si la connexion (ex. Neon) fonctionne.\n"
            "- `data.database` = **error** si la base est injoignable."
        ),
        security=[],
    )
    def get(self):
        db_status = "ok"
        try:
            db.session.execute(db.text("SELECT 1"))
        except Exception:
            db_status = "error"
        return ApiResponse.ok(data={"status": "ok", "database": db_status})
