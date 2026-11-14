"""Configuration de l'application, lue depuis les variables d'environnement."""
import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

_BACKEND_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(_BACKEND_ROOT / ".env")


def normaliser_url_base(url: str | None) -> str | None:
    """Adapte l'URL fournie par Neon au pilote psycopg2 de SQLAlchemy."""
    if not url:
        return url
    for prefixe in ("postgres://", "postgresql://"):
        if url.startswith(prefixe):
            return "postgresql+psycopg2://" + url[len(prefixe):]
    return url


def _split_origins(value: str | None) -> list[str]:
    if not value:
        return ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"]
    return [origin.strip() for origin in value.split(",") if origin.strip()]


class Config:
    SQLALCHEMY_DATABASE_URI = normaliser_url_base(os.getenv("DATABASE_URL"))
    SECRET_KEY = os.getenv("SECRET_KEY", "")
    INTERNAL_CRON_KEY = os.getenv("INTERNAL_CRON_KEY", "")
    CORS_ORIGINS = _split_origins(os.getenv("CORS_ORIGINS"))

    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")
    CLOUDINARY_FOLDER = os.getenv("CLOUDINARY_FOLDER", "gbandjo/products")
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    DELAI_EXPIRATION_RESERVATION_HEURES = 24

    API_TITLE = "Gbandjo API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_JSON_PATH = "api/openapi.json"
    OPENAPI_SWAGGER_UI_PATH = "/api/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    OPENAPI_SWAGGER_UI_CONFIG = {"displayRequestDuration": True, "persistAuthorization": True}
    API_SPEC_OPTIONS = {
        "components": {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT",
                    "description": (
                        "Copiez uniquement data.access_token (sans le mot Bearer). "
                        "Issu de POST /api/auth/login ou register/*."
                    ),
                }
            }
        },
    }

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.getenv("JWT_ACCESS_MINUTES", "30")))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", "7")))
    JWT_ALGORITHM = "HS256"


class TestConfig(Config):
    TESTING = True
    SECRET_KEY = "cle-de-test"
