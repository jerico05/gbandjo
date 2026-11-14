"""Administration — catégories produit."""
from http import HTTPStatus

from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.auth_middleware import jwt_required
from app.middleware.role_middleware import require_role
from app.models.enums import UserRole
from app.schemas.category_schema import CategoryCreateInputSchema, CategoryResponseSchema
from app.schemas.common import EnvelopeErrorSchema
from app.services.category_service import CategoryService
from app.utils.responses import ApiResponse

admin_categories_blp = Blueprint(
    "admin_categories",
    __name__,
    url_prefix="/api/admin/categories",
    description="Catégories produit : création par l'administrateur.",
)

_service = CategoryService()


@admin_categories_blp.route("")
class AdminCategoryCreate(MethodView):
    @jwt_required
    @require_role(UserRole.ADMIN)
    @admin_categories_blp.arguments(CategoryCreateInputSchema)
    @admin_categories_blp.response(HTTPStatus.CREATED, CategoryResponseSchema)
    @admin_categories_blp.alt_response(409, schema=EnvelopeErrorSchema)
    @admin_categories_blp.doc(
        summary="Créer une catégorie",
        description="Les commerçants choisissent ces catégories à la création d'un produit.",
        security=[{"bearerAuth": []}],
    )
    def post(self, payload):
        category = _service.create_category(payload["name"])
        return ApiResponse.created(data={"category": category}, message="Catégorie créée.")
