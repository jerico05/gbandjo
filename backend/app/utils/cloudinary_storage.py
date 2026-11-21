"""Upload d'images vers Cloudinary."""
from __future__ import annotations

import uuid
from typing import BinaryIO

from flask import current_app

from app.utils.responses import ApiError


def cloudinary_configured() -> bool:
    cfg = current_app.config
    return bool(cfg.get("CLOUDINARY_CLOUD_NAME") and cfg.get("CLOUDINARY_API_KEY") and cfg.get("CLOUDINARY_API_SECRET"))


def upload_product_image(file_stream: BinaryIO, *, product_id: int, filename: str | None = None) -> str:
    if not cloudinary_configured():
        raise ApiError(
            "Stockage Cloudinary non configuré (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
            status=503,
        )
    import cloudinary
    import cloudinary.uploader

    cloudinary.config(
        cloud_name=current_app.config["CLOUDINARY_CLOUD_NAME"],
        api_key=current_app.config["CLOUDINARY_API_KEY"],
        api_secret=current_app.config["CLOUDINARY_API_SECRET"],
        secure=True,
    )
    public_id = f"product_{product_id}_{uuid.uuid4().hex[:12]}"
    try:
        result = cloudinary.uploader.upload(
            file_stream,
            public_id=public_id,
            folder=current_app.config["CLOUDINARY_FOLDER"],
            resource_type="image",
            overwrite=False,
        )
    except Exception as err:
        raise ApiError("Échec de l'envoi de l'image vers Cloudinary.", status=502) from err
    return result.get("secure_url") or result.get("url") or ""
