"""Fonctions de dates (anciennement ``app.utils``)."""
from datetime import datetime, timezone


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def as_utc(valeur: datetime) -> datetime:
    if valeur.tzinfo is None:
        return valeur.replace(tzinfo=timezone.utc)
    return valeur
