"""Point d'entrée WSGI (Gunicorn, `flask --app wsgi`)."""
from app import create_app

app = create_app()
