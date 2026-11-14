"""Alias local : `flask --app run run` (équivalent à wsgi.py)."""
from app import create_app

app = create_app()
