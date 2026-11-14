"""Schémas Marshmallow — authentification (Swagger)."""
from marshmallow import Schema, fields, validate

from app.schemas.common import EnvelopeErrorSchema, EnvelopeSchema
from app.schemas.user_schema import ProfileResponseSchema, UserOutputSchema

__all__ = ["EnvelopeErrorSchema", "EnvelopeSchema", "ProfileResponseSchema"]


class RegisterInputSchema(Schema):
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=100), metadata={"example": "Kpossou"})
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=100), metadata={"example": "Ama"})
    email = fields.Email(required=True, metadata={"example": "commercant@gbandjo.tg"})
    password = fields.Str(
        required=True,
        load_only=True,
        validate=validate.Length(min=8, max=128),
        metadata={"example": "MotDePasse#1"},
    )
    phone = fields.Str(load_default=None, validate=validate.Length(max=30), metadata={"example": "90000000"})


class LoginInputSchema(Schema):
    email = fields.Email(required=True, metadata={"example": "commercant@gbandjo.tg"})
    password = fields.Str(required=True, load_only=True, metadata={"example": "MotDePasse#1"})


class RefreshInputSchema(Schema):
    refresh_token = fields.Str(required=True)


class TokensDataSchema(Schema):
    access_token = fields.Str()
    refresh_token = fields.Str()
    token_type = fields.Str()
    user = fields.Nested(UserOutputSchema)


class TokensResponseSchema(EnvelopeSchema):
    data = fields.Nested(TokensDataSchema)


class HealthDataSchema(Schema):
    status = fields.Str(metadata={"example": "ok"})
    database = fields.Str(metadata={"example": "ok", "description": "ok ou error"})


class HealthResponseSchema(EnvelopeSchema):
    data = fields.Nested(HealthDataSchema)
