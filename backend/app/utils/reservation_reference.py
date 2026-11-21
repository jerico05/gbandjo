"""Référence publique unique pour les réservations (retrait / reçu)."""
from __future__ import annotations

from datetime import datetime


def build_reservation_reference(reservation_id: int, created_at: datetime) -> str:
    """Format : GBJ-AAAAMMJJ-000123 (lisible, unique via id + date)."""
    date_part = created_at.strftime("%Y%m%d")
    return f"GBJ-{date_part}-{reservation_id:06d}"