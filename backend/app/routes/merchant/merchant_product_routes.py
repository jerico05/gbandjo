"""Module 4 — produits commerçant."""
from http import HTTPStatus

from flask import g, request
from flask.views import MethodView
from flask_smorest import Blueprint

from app.middleware.role_middleware import require_valid_store
from app.schemas.common import EnvelopeErrorSchema, EnvelopeSchema
from app.schemas.product_schema import (
    ProductCreateInputSchema,
    ProductImageInputSchema,
    ProductListResponseSchema,
    ProductResponseSchema,
    ProductUpdateInputSchema,
)
from app.services.product_service import ProductService
from app.utils.responses import ApiResponse

merchant_products_blp = Blueprint(
    "merchant_products",
    __name__,
    url_prefix="/api/merchant/products",
    description="Module 4 : CRUD produits et images (commerce validé).",
)

_service = ProductService()


@merchant_products_blp.route("")
class MerchantProducts(MethodView):
    @require_valid_store
    @merchant_products_blp.response(HTTPStatus.OK, ProductListResponseSchema)
    @merchant_products_blp.doc(summary="Lister mes produits", security=[{"bearerAuth": []}])
    def get(self):
        return ApiResponse.ok(data={"products": _service.list_products(g.store)})

    @require_valid_store
    @merchant_products_blp.arguments(ProductCreateInputSchema)
    @merchant_products_blp.response(HTTPStatus.CREATED, ProductResponseSchema)
    @merchant_products_blp.alt_response(404, schema=EnvelopeErrorSchema)
    @merchant_products_blp.doc(summary="Créer un produit", security=[{"bearerAuth": []}])
    def post(self, payload):
        product = _service.create_product(g.store, payload)
        return ApiResponse.created(data={"product": product}, message="Produit créé.")


@merchant_products_blp.route("/<int:product_id>")
class MerchantProductDetail(MethodView):
    @require_valid_store
    @merchant_products_blp.arguments(ProductUpdateInputSchema)
    @merchant_products_blp.response(HTTPStatus.OK, ProductResponseSchema)
    @merchant_products_blp.doc(summary="Modifier un produit", security=[{"bearerAuth": []}])
    def patch(self, payload, product_id: int):
        product = _service.update_product(g.store, product_id, payload)
        return ApiResponse.ok(data={"product": product}, message="Produit mis à jour.")

    @require_valid_store
    @merchant_products_blp.response(HTTPStatus.OK, EnvelopeSchema)
    @merchant_products_blp.alt_response(409, schema=EnvelopeErrorSchema)
    @merchant_products_blp.doc(summary="Supprimer un produit", security=[{"bearerAuth": []}])
    def delete(self, product_id: int):
        _service.delete_product(g.store, product_id)
        return ApiResponse.ok(message="Produit supprimé.")


@merchant_products_blp.route("/<int:product_id>/images")
class MerchantProductImages(MethodView):
    @require_valid_store
    @merchant_products_blp.arguments(ProductImageInputSchema)
    @merchant_products_blp.response(HTTPStatus.CREATED, ProductResponseSchema)
    @merchant_products_blp.doc(summary="Ajouter une image (URL)", security=[{"bearerAuth": []}])
    def post(self, payload, product_id: int):
        product = _service.add_image(g.store, product_id, payload)
        return ApiResponse.created(data={"product": product}, message="Image ajoutée.")


@merchant_products_blp.route("/<int:product_id>/images/upload")
class MerchantProductImageUpload(MethodView):
    @require_valid_store
    @merchant_products_blp.response(HTTPStatus.CREATED, ProductResponseSchema)
    @merchant_products_blp.alt_response(502, schema=EnvelopeErrorSchema)
    @merchant_products_blp.alt_response(503, schema=EnvelopeErrorSchema)
    @merchant_products_blp.doc(
        summary="Envoyer une image (Cloudinary)",
        description="Multipart : champ `image` (fichier), optionnel `sort_order`.",
        security=[{"bearerAuth": []}],
    )
    def post(self, product_id: int):
        file = request.files.get("image")
        sort_order = request.form.get("sort_order", 0, type=int)
        product = _service.upload_image(g.store, product_id, file, sort_order=sort_order or 0)
        return ApiResponse.created(data={"product": product}, message="Image envoyée vers Cloudinary.")


@merchant_products_blp.route("/<int:product_id>/images/<int:image_id>")
class MerchantProductImageDelete(MethodView):
    @require_valid_store
    @merchant_products_blp.response(HTTPStatus.OK, ProductResponseSchema)
    @merchant_products_blp.doc(summary="Supprimer une image", security=[{"bearerAuth": []}])
    def delete(self, product_id: int, image_id: int):
        product = _service.delete_image(g.store, product_id, image_id)
        return ApiResponse.ok(data={"product": product}, message="Image supprimée.")
