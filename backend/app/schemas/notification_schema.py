from marshmallow import Schema, fields

from app.schemas.common import EnvelopeSchema


class NotificationOutputSchema(Schema):
    id = fields.Int()
    type = fields.Str()
    message = fields.Str()
    is_read = fields.Bool()
    reservation_id = fields.Int(allow_none=True)
    created_at = fields.Str()


class PaginationSchema(Schema):
    page = fields.Int()
    per_page = fields.Int()
    total = fields.Int()
    pages = fields.Int()
    has_next = fields.Bool()
    has_prev = fields.Bool()


class NotificationListDataSchema(Schema):
    notifications = fields.List(fields.Nested(NotificationOutputSchema))
    pagination = fields.Nested(PaginationSchema)
    unread_count = fields.Int()


class NotificationListResponseSchema(EnvelopeSchema):
    data = fields.Nested(NotificationListDataSchema)


class NotificationDataSchema(Schema):
    notification = fields.Nested(NotificationOutputSchema)


class NotificationResponseSchema(EnvelopeSchema):
    data = fields.Nested(NotificationDataSchema)


class MarkAllReadDataSchema(Schema):
    updated_count = fields.Int()


class MarkAllReadResponseSchema(EnvelopeSchema):
    data = fields.Nested(MarkAllReadDataSchema)
