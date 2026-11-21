"""Vérifie la configuration Cloudinary (.env) et teste l'API ping."""
from __future__ import annotations

import os
import sys
from pathlib import Path

_BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(_BACKEND))

from dotenv import load_dotenv

load_dotenv(_BACKEND / ".env")

REQUIRED = ("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET")


def main() -> int:
    missing = [k for k in REQUIRED if not os.getenv(k, "").strip()]
    folder = os.getenv("CLOUDINARY_FOLDER", "gbandjo/products")
    print(f"CLOUDINARY_FOLDER: {folder or 'gbandjo/products (défaut)'}")

    if missing:
        print("Variables manquantes:", ", ".join(missing))
        return 1

    print("Variables Cloudinary: OK")

    try:
        import cloudinary
        import cloudinary.api

        cloudinary.config(
            cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
            api_key=os.environ["CLOUDINARY_API_KEY"],
            api_secret=os.environ["CLOUDINARY_API_SECRET"],
            secure=True,
        )
        ping = cloudinary.api.ping()
        status = ping.get("status", ping)
        print("Ping Cloudinary:", status)
        return 0 if status == "ok" else 2
    except Exception as err:
        print("Ping Cloudinary: échec", type(err).__name__, str(err)[:200])
        return 2


if __name__ == "__main__":
    raise SystemExit(main())