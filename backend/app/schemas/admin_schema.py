from marshmallow import Schema, fields, validate

from app.schemas.common import EnvelopeSchema
from app.schemas.offer_schema import OfferMerchantOutputSchema
from app.schemas.user_schema import UserOutputSchema
from app.schemas.notification_schema import PaginationSchema


class AdminUserListDataSchema(Schema):
    users = fields.List(fields.Nested(UserOutputSchema))
    pagination = fields.Nested(PaginationSchema)


class AdminUserListResponseSchema(EnvelopeSchema):
    data = fields.Nested(AdminUserListDataSchema)


class AccountStatusInputSchema(Schema):
    account_status = fields.Str(
        required=True,
        validate=validate.OneOf(["ACTIF", "SUSPENDU", "DESACTIVE"]),
    )


class AdminUserDataSchema(Schema):
    user = fields.Nested(UserOutputSchema)


class AdminUserResponseSchema(EnvelopeSchema):
    data = fields.Nested(AdminUserDataSchema)


class AdminOfferOutputSchema(OfferMerchantOutputSchema):
    store_id = fields.Int()
    store_name = fields.Str()


class AdminOfferListDataSchema(Schema):
    offers = fields.List(fields.Nested(AdminOfferOutputSchema))
    pagination = fields.Nested(PaginationSchema)


class AdminOfferListResponseSchema(EnvelopeSchema):
    data = fields.Nested(AdminOfferListDataSchema)


class AdminOfferDataSchema(Schema):
    offer = fields.Nested(OfferMerchantOutputSchema)


class AdminOfferResponseSchema(EnvelopeSchema):
    data = fields.Nested(AdminOfferDataSchema)


class DashboardStatsSchema(Schema):
    totals = fields.Dict()
    users_by_role = fields.Dict()
    users_by_account_status = fields.Dict()
    stores_by_validation_status = fields.Dict()
    offers_by_status = fields.Dict()
    reservations_activity = fields.Int()


class DashboardDataSchema(Schema):
    stats = fields.Nested(DashboardStatsSchema)


class DashboardResponseSchema(EnvelopeSchema):
    data = fields.Nested(DashboardDataSchema)
