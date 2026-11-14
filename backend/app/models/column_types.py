"""Types de colonnes réutilisés par les modèles."""
import enum

from sqlalchemy import Enum


def enum_column(enum_class: type[enum.Enum], name: str) -> Enum:
    """Énumération stockée en texte avec une contrainte CHECK (portable et migrable)."""
    return Enum(
        enum_class,
        name=name,
        native_enum=False,
        create_constraint=True,
        length=20,
        validate_strings=True,
    )
