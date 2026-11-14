"""Schémas d'enveloppe partagés."""
from marshmallow import Schema, fields


class EnvelopeErrorSchema(Schema):
    message = fields.Str()
    errors = fields.Raw(allow_none=True)


class EnvelopeSchema(Schema):
    data = fields.Raw(allow_none=True)
    message = fields.Str(allow_none=True)
