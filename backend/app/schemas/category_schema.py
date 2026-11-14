from marshmallow import Schema, fields

from app.schemas.common import EnvelopeSchema


class CategoryOutputSchema(Schema):
    id = fields.Int()
    name = fields.Str()


class CategoryListDataSchema(Schema):
    categories = fields.List(fields.Nested(CategoryOutputSchema))


class CategoryListResponseSchema(EnvelopeSchema):
    data = fields.Nested(CategoryListDataSchema)


class CategoryCreateInputSchema(Schema):
    name = fields.Str(required=True)


class CategoryDataSchema(Schema):
    category = fields.Nested(CategoryOutputSchema)


class CategoryResponseSchema(EnvelopeSchema):
    data = fields.Nested(CategoryDataSchema)
