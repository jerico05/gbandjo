# Structure backend Gbandjo

## Conventions

- **Code** : fichiers, classes, champs JSON en anglais
- **Base** : tables/colonnes françaises mappées via SQLAlchemy
- **API** : messages et Swagger en français

## Arborescence actuelle

```
backend/
├── wsgi.py
├── run.py
├── app/
│   ├── __init__.py          # create_app, CORS, validation .env
│   ├── config/settings.py
│   ├── extensions.py
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   │   ├── cloudinary_storage.py
│   │   ├── pagination.py
│   │   └── geo.py
│   ├── errors/
│   └── routes/
│       ├── auth_routes.py
│       ├── user_routes.py
│       ├── store_routes.py
│       ├── category_routes.py      # GET public
│       ├── offer_routes.py         # catalogue public
│       ├── notification_routes.py
│       ├── system_routes.py
│       ├── internal_routes.py
│       ├── admin/
│       │   ├── admin_store_routes.py
│       │   ├── admin_category_routes.py
│       │   ├── admin_user_routes.py
│       │   ├── admin_offer_routes.py
│       │   └── admin_dashboard_routes.py
│       ├── merchant/
│       │   ├── merchant_product_routes.py
│       │   ├── merchant_offer_routes.py
│       │   └── merchant_reservation_routes.py
│       └── consumer/
│           └── consumer_reservation_routes.py
├── migrations/
└── tests/
    ├── test_auth.py
    ├── test_users.py
    ├── test_stores.py
    ├── test_catalog_api.py
    ├── test_reservations_api.py
    ├── test_notifications_api.py
    ├── test_admin_api.py
    ├── test_models.py
    └── factories.py
```

## Modules API (implémentés)

| # | Domaine | Préfixe principal |
|---|---------|-------------------|
| 1 | Auth | `/api/auth` |
| 2 | Profil | `/api/users` |
| 3 | Commerces | `/api/stores`, `/api/admin/stores` |
| 4 | Catalogue | `/api/categories`, `/api/offers`, `/api/merchant/products`, `/api/merchant/offers` |
| 5 | Réservations | `/api/consumer/reservations`, `/api/merchant/reservations`, `/internal/expirer-reservations` |
| 6 | Notifications | `/api/notifications` |
| 7 | Admin | `/api/admin/users`, `/api/admin/offers`, `/api/admin/dashboard`, `/api/admin/categories` |

## Variables d'environnement

| Variable | Obligatoire | Rôle |
|----------|-------------|------|
| `DATABASE_URL` | Oui | PostgreSQL |
| `SECRET_KEY` | Oui | JWT |
| `CLOUDINARY_*` | Pour upload image | Stockage médias |
| `CORS_ORIGINS` | Non | Frontends autorisés |
| `TEST_DATABASE_URL` | Tests | Base de test |
