from marshmallow import Schema, fields, validate

from app.schemas.common import EnvelopeSchema


class ReservationStoreEmbedSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    address = fields.Str()
    phone = fields.Str(allow_none=True)
    latitude = fields.Float()
    longitude = fields.Float()


class ReservationOutputSchema(Schema):
    id = fields.Int()
    reference = fields.Str()
    offer_id = fields.Int()
    offer_label = fields.Str(allow_none=True)
    consumer_id = fields.Int()
    quantity = fields.Int()
    unit_price = fields.Str()
    status = fields.Str()
    created_at = fields.Str()
    expires_at = fields.Str()
    processed_at = fields.Str(allow_none=True)
    reason = fields.Str(allow_none=True)
    cancelled_by_role = fields.Str(allow_none=True)
    store = fields.Nested(ReservationStoreEmbedSchema, allow_none=True)


class ReservationCreateInputSchema(Schema):
    offer_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))


class ReservationUpdateInputSchema(Schema):
    quantity = fields.Int(required=True, validate=validate.Range(min=1))


class ReservationRejectInputSchema(Schema):
    reason = fields.Str(allow_none=True, validate=validate.Length(max=2000))


class ReservationDataSchema(Schema):
    reservation = fields.Nested(ReservationOutputSchema)


class ReservationListDataSchema(Schema):
    reservations = fields.List(fields.Nested(ReservationOutputSchema))


class ReservationResponseSchema(EnvelopeSchema):
    data = fields.Nested(ReservationDataSchema)


class ReservationListResponseSchema(EnvelopeSchema):
    data = fields.Nested(ReservationListDataSchema)


class ExpireReservationsDataSchema(Schema):
    expired_count = fields.Int()


class ExpireReservationsResponseSchema(EnvelopeSchema):
    data = fields.Nested(ExpireReservationsDataSchema)
