"""Module 7 — tableau de bord admin."""
from http import HTTPStatus

from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.middleware.role_middleware import require_role
from app.models.enums import UserRole
from app.schemas.admin_schema import DashboardResponseSchema
from app.services.dashboard_service import DashboardService
from app.utils.responses import ApiResponse

admin_dashboard_blp = Blueprint(
    "admin_dashboard",
    __name__,
    url_prefix="/api/admin/dashboard",
    description="Module 7 : statistiques globales.",
)

_service = DashboardService()


@admin_dashboard_blp.route("/stats")
class AdminDashboardStats(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_dashboard_blp.response(HTTPStatus.OK, DashboardResponseSchema)
    @admin_dashboard_blp.doc(summary="Statistiques globales", security=[{"bearerAuth": []}])
    def get(self):
        return ApiResponse.ok(data={"stats": _service.global_stats()})
