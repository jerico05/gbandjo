from marshmallow import Schema, fields, validate

from app.schemas.common import EnvelopeSchema


class StoreOutputSchema(Schema):
    id = fields.Int()
    owner_id = fields.Int()
    name = fields.Str()
    description = fields.Str(allow_none=True)
    activity_type = fields.Str()
    address = fields.Str()
    phone = fields.Str(allow_none=True)
    latitude = fields.Float()
    longitude = fields.Float()
    validation_status = fields.Str()
    rejection_reason = fields.Str(allow_none=True)
    created_at = fields.Str()


class StoreDataSchema(Schema):
    store = fields.Nested(StoreOutputSchema)


class StoreResponseSchema(EnvelopeSchema):
    data = fields.Nested(StoreDataSchema)


class StoreListDataSchema(Schema):
    stores = fields.List(fields.Nested(StoreOutputSchema))


class StoreListResponseSchema(EnvelopeSchema):
    data = fields.Nested(StoreListDataSchema)


class StoreCreateInputSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    description = fields.Str(allow_none=True)
    activity_type = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    address = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    phone = fields.Str(allow_none=True, validate=validate.Length(max=30))
    latitude = fields.Float(required=True, validate=validate.Range(min=-90, max=90))
    longitude = fields.Float(required=True, validate=validate.Range(min=-180, max=180))


class StoreUpdateInputSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1, max=150))
    description = fields.Str(allow_none=True)
    activity_type = fields.Str(validate=validate.Length(min=1, max=100))
    address = fields.Str(validate=validate.Length(min=1, max=255))
    phone = fields.Str(allow_none=True, validate=validate.Length(max=30))
    latitude = fields.Float(validate=validate.Range(min=-90, max=90))
    longitude = fields.Float(validate=validate.Range(min=-180, max=180))


class StoreRejectInputSchema(Schema):
    rejection_reason = fields.Str(required=True, validate=validate.Length(min=1))
