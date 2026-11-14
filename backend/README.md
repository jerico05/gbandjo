# Gbandjo — backend API (Flask, PostgreSQL)

API REST pour la plateforme de valorisation des invendus à Lomé.  
**Modules 1 à 7 implémentés** (auth, profil, commerces, catalogue, réservations, notifications, admin).

Documentation interactive : [http://127.0.0.1:5000/api/docs](http://127.0.0.1:5000/api/docs)

## Prérequis

- Python **3.10+** (testé 3.12 / 3.14)
- PostgreSQL (Neon ou local)
- Compte **Cloudinary** (upload images produits commerçant)

## Installation

```bash
cd backend
python -m venv .venv
# Windows :
.\.venv\Scripts\activate
# Linux / macOS :
# source .venv/bin/activate

pip install -r requirements-dev.txt
cp .env.example .env
```

Renseigner dans **`.env`** (obligatoire au démarrage) :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Chaîne PostgreSQL (Neon) |
| `SECRET_KEY` | Clé JWT (longue, aléatoire) |
| `CLOUDINARY_*` | Cloud name, API key, secret |
| `CORS_ORIGINS` | Origines front (virgules), optionnel |

## Lancer l'API

```bash
flask --app wsgi run
# ou
flask --app run run
```

Sans `SECRET_KEY` ou `DATABASE_URL`, l'application **refuse de démarrer** (sauf mode test `TESTING`).

## Migrations

```bash
flask --app wsgi db upgrade
flask --app wsgi db migrate -m "description"
```

## Tests (unitaires / intégration API)

```bash
pytest
```

- Utiliser une base **dédiée** : `TEST_DATABASE_URL` (≠ `DATABASE_URL`).
- Sur Windows, `pgserver` peut être indisponible → une instance PostgreSQL locale ou Neon de test est recommandée.

## Images produits (Cloudinary)

1. Admin crée des **catégories** : `POST /api/admin/categories` `{ "name": "..." }`.
2. Commerçant crée un produit avec `category_id`.
3. Upload image :
   - **Multipart** : `POST /api/merchant/products/{id}/images/upload` (champ `image`)
   - **URL** : `POST /api/merchant/products/{id}/images` `{ "url": "https://..." }`

Les fichiers sont stockés sur Cloudinary ; l’URL sécurisée est enregistrée en base.

## CORS

Par défaut : `localhost:3000`, `5173` (Vite). Personnaliser avec `CORS_ORIGINS`.

## Structure

```
backend/
  wsgi.py              # point d'entrée WSGI / flask --app wsgi
  run.py               # alias équivalent
  app/
    routes/            # blueprints REST + Swagger
    services/          # logique métier
    repositories/      # accès données
    models/            # SQLAlchemy
    middleware/        # JWT, rôles
    utils/             # pagination, Cloudinary, géo, …
  migrations/
  tests/               # test_*_api.py, test_models.py
```

Voir aussi `structure.md` à la racine du dépôt.

## Conventions

- **Code / JSON** : anglais (`last_name`, `store`, …)
- **Messages API & Swagger** : français
- **Tables PostgreSQL** : noms historiques français mappés en anglais dans les modèles

## Compte administrateur

Pas d’inscription publique admin : création en base ou script one-shot. Connexion via `POST /api/auth/login`.
