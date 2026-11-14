from marshmallow import Schema, fields, validate

from app.schemas.common import EnvelopeSchema


class UserOutputSchema(Schema):
    id = fields.Int()
    last_name = fields.Str()
    first_name = fields.Str()
    email = fields.Str()
    phone = fields.Str(allow_none=True)
    role = fields.Str()
    account_status = fields.Str()
    created_at = fields.Str()


class ProfileDataSchema(Schema):
    user = fields.Nested(UserOutputSchema)


class ProfileResponseSchema(EnvelopeSchema):
    data = fields.Nested(ProfileDataSchema)


class ProfileUpdateInputSchema(Schema):
    last_name = fields.Str(validate=validate.Length(min=1, max=100))
    first_name = fields.Str(validate=validate.Length(min=1, max=100))
    phone = fields.Str(allow_none=True, validate=validate.Length(max=30))
    email = fields.Email()


class PasswordChangeInputSchema(Schema):
    old_password = fields.Str(required=True, load_only=True)
    new_password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8, max=128))
