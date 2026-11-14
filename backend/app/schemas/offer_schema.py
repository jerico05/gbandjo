from marshmallow import Schema, fields, validate

from app.schemas.common import EnvelopeSchema


class OfferMerchantOutputSchema(Schema):
    id = fields.Int()
    product_id = fields.Int()
    product_name = fields.Str(allow_none=True)
    initial_price = fields.Str()
    discounted_price = fields.Str()
    discount_percentage = fields.Str()
    available_quantity = fields.Int()
    starts_at = fields.Str()
    ends_at = fields.Str()
    expiry_date = fields.Str(allow_none=True)
    status = fields.Str()


class OfferCreateInputSchema(Schema):
    product_id = fields.Int(required=True)
    initial_price = fields.Decimal(required=True, as_string=True, places=2)
    discounted_price = fields.Decimal(required=True, as_string=True, places=2)
    available_quantity = fields.Int(required=True)
    starts_at = fields.DateTime(required=True)
    ends_at = fields.DateTime(required=True)
    expiry_date = fields.Date(allow_none=True)


class OfferUpdateInputSchema(Schema):
    initial_price = fields.Decimal(as_string=True, places=2)
    discounted_price = fields.Decimal(as_string=True, places=2)
    available_quantity = fields.Int()
    starts_at = fields.DateTime()
    ends_at = fields.DateTime()
    expiry_date = fields.Date(allow_none=True)


class OfferMerchantDataSchema(Schema):
    offer = fields.Nested(OfferMerchantOutputSchema)


class OfferMerchantListDataSchema(Schema):
    offers = fields.List(fields.Nested(OfferMerchantOutputSchema))


class OfferMerchantResponseSchema(EnvelopeSchema):
    data = fields.Nested(OfferMerchantDataSchema)


class OfferMerchantListResponseSchema(EnvelopeSchema):
    data = fields.Nested(OfferMerchantListDataSchema)


class OfferConsumerOutputSchema(Schema):
    id = fields.Int()
    initial_price = fields.Str()
    discounted_price = fields.Str()
    discount_percentage = fields.Str()
    available_quantity = fields.Int()
    starts_at = fields.Str()
    ends_at = fields.Str()
    expiry_date = fields.Str(allow_none=True)
    status = fields.Str()
    distance_km = fields.Float(allow_none=True)
    product = fields.Dict()
    store = fields.Dict()


class OfferListDataSchema(Schema):
    offers = fields.List(fields.Nested(OfferConsumerOutputSchema))


class OfferListResponseSchema(EnvelopeSchema):
    data = fields.Nested(OfferListDataSchema)


class OfferDetailDataSchema(Schema):
    offer = fields.Nested(OfferConsumerOutputSchema)


class OfferDetailResponseSchema(EnvelopeSchema):
    data = fields.Nested(OfferDetailDataSchema)
