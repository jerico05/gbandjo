"""Énumérations métier (valeurs inchangées en base)."""
import enum


class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    COMMERCANT = "COMMERCANT"
    CONSOMMATEUR = "CONSOMMATEUR"


class AccountStatus(enum.Enum):
    ACTIF = "ACTIF"
    SUSPENDU = "SUSPENDU"
    DESACTIVE = "DESACTIVE"


class ValidationStatus(enum.Enum):
    EN_ATTENTE = "EN_ATTENTE"
    VALIDE = "VALIDE"
    REJETE = "REJETE"


class OfferStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    DESACTIVEE = "DESACTIVEE"
    RETIREE = "RETIREE"


class ReservationStatus(enum.Enum):
    EN_ATTENTE = "EN_ATTENTE"
    CONFIRMEE = "CONFIRMEE"
    REJETEE = "REJETEE"
    ANNULEE = "ANNULEE"
    EXPIREE = "EXPIREE"
    RETIREE = "RETIREE"
