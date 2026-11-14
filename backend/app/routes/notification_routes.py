"""Module 6 — notifications utilisateur."""
from http import HTTPStatus

from flask import g, request
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.schemas.common import EnvelopeErrorSchema
from app.schemas.notification_schema import (
    MarkAllReadResponseSchema,
    NotificationListResponseSchema,
    NotificationResponseSchema,
)
from app.services.notification_service import NotificationService
from app.utils.responses import ApiResponse

notifications_blp = Blueprint(
    "notifications",
    __name__,
    url_prefix="/api/notifications",
    description="Module 6 : consulter et marquer ses notifications.",
)

_service = NotificationService()


@notifications_blp.route("")
class NotificationList(MethodView):
    @jwt_required
    @notifications_blp.response(HTTPStatus.OK, NotificationListResponseSchema)
    @notifications_blp.doc(
        summary="Lister mes notifications",
        description="Query : `page`, `per_page` (max 100), `unread_only=true` pour filtrer les non lues.",
        security=[{"bearerAuth": []}],
    )
    def get(self):
        unread_only = request.args.get("unread_only", "").lower() in {"1", "true", "yes"}
        payload = _service.list_mine(
            g.user,
            page=request.args.get("page", type=int),
            per_page=request.args.get("per_page", type=int),
            unread_only=unread_only,
        )
        return ApiResponse.ok(data=payload)


@notifications_blp.route("/<int:notification_id>/read")
class NotificationMarkRead(MethodView):
    @jwt_required
    @notifications_blp.response(HTTPStatus.OK, NotificationResponseSchema)
    @notifications_blp.alt_response(404, schema=EnvelopeErrorSchema)
    @notifications_blp.doc(summary="Marquer une notification comme lue", security=[{"bearerAuth": []}])
    def post(self, notification_id: int):
        notification = _service.mark_read(g.user, notification_id)
        return ApiResponse.ok(data={"notification": notification}, message="Notification marquée comme lue.")


@notifications_blp.route("/read-all")
class NotificationMarkAllRead(MethodView):
    @jwt_required
    @notifications_blp.response(HTTPStatus.OK, MarkAllReadResponseSchema)
    @notifications_blp.doc(summary="Marquer toutes mes notifications comme lues", security=[{"bearerAuth": []}])
    def post(self):
        result = _service.mark_all_read(g.user)
        return ApiResponse.ok(data=result, message="Toutes les notifications ont été marquées comme lues.")
