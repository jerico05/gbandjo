"""Pagination simple pour les listes API."""
from __future__ import annotations

from math import ceil


def normalize_page_params(page: int | None, per_page: int | None, *, default: int = 20, maximum: int = 100) -> tuple[int, int]:
    page = page if page and page > 0 else 1
    per_page = per_page if per_page and per_page > 0 else default
    per_page = min(per_page, maximum)
    return page, per_page


def pagination_meta(total: int, page: int, per_page: int) -> dict:
    pages = max(1, ceil(total / per_page)) if total else 1
    return {
        "page": page,
        "per_page": per_page,
        "total": total,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1,
    }
