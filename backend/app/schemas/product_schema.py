from marshmallow import Schema, fields, validate

from app.schemas.common import EnvelopeSchema


class ProductImageSchema(Schema):
    id = fields.Int()
    url = fields.Str()
    sort_order = fields.Int()


class ProductOutputSchema(Schema):
    id = fields.Int()
    store_id = fields.Int()
    category_id = fields.Int()
    category_name = fields.Str(allow_none=True)
    name = fields.Str()
    description = fields.Str(allow_none=True)
    is_active = fields.Bool()
    images = fields.List(fields.Nested(ProductImageSchema))


class ProductDataSchema(Schema):
    product = fields.Nested(ProductOutputSchema)


class ProductListDataSchema(Schema):
    products = fields.List(fields.Nested(ProductOutputSchema))


class ProductResponseSchema(EnvelopeSchema):
    data = fields.Nested(ProductDataSchema)


class ProductListResponseSchema(EnvelopeSchema):
    data = fields.Nested(ProductListDataSchema)


class ProductCreateInputSchema(Schema):
    category_id = fields.Int(required=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    description = fields.Str(allow_none=True)
    is_active = fields.Bool(load_default=True)


class ProductUpdateInputSchema(Schema):
    category_id = fields.Int()
    name = fields.Str(validate=validate.Length(min=1, max=150))
    description = fields.Str(allow_none=True)
    is_active = fields.Bool()


class ProductImageInputSchema(Schema):
    url = fields.Url(required=True)
    sort_order = fields.Int(load_default=0)
