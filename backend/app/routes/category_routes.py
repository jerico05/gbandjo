"""Module 4 — catégories (lecture publique)."""
from http import HTTPStatus

from flask.views import MethodView
from flask_smorest import Blueprint

from app.schemas.category_schema import CategoryListResponseSchema
from app.services.category_service import CategoryService
from app.utils.responses import ApiResponse

categories_blp = Blueprint(
    "categories",
    __name__,
    url_prefix="/api/categories",
    description="Module 4 : liste des catégories produit.",
)


@categories_blp.route("")
class CategoryList(MethodView):
    @categories_blp.response(HTTPStatus.OK, CategoryListResponseSchema)
    @categories_blp.doc(summary="Lister les catégories", security=[])
    def get(self):
        return ApiResponse.ok(data={"categories": CategoryService().list_categories()})
