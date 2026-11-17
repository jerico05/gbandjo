# Suivi frontend — Gbandjo

Tous les modules prévus dans `agent.MD` sont **branchés** sur l’API Flask.

## `frontend-app` — ✅ complet

| Module | Route | API |
|--------|-------|-----|
| Landing | `/` | offres / catégories |
| Marketplace + filtres + géo | `/offres` | `GET /api/offers` (distance, prix, réduction) |
| Détail + réservation | `/offres/:id` | offres + `POST /api/consumer/reservations` |
| Auth | `/connexion`, `/inscription` | `/api/auth/*` |
| Réservations | `/reservations` | consumer reservations |
| Notifications paginées | `/notifications` | `/api/notifications` |
| Profil | `/profil` | `/api/users/profile`, password |
| Commerçant — commerce | `/mon-commerce` | `/api/stores/me` |
| Produits + images | `/mon-commerce/produits` | CRUD + Cloudinary upload/URL |
| Offres | `/mon-commerce/offres` | publish, deactivate, withdraw |
| Réservations | `/mon-commerce/reservations` | confirm, reject, picked-up, cancel |
| PWA | — | install prompt + service worker |

## `frontend-admin` — ✅ complet

| Module | Route | API |
|--------|-------|-----|
| Connexion | `/connexion` | login ADMIN |
| Dashboard + graphiques | `/tableau-de-bord` | stats + Recharts |
| Utilisateurs paginés | `/utilisateurs` | list + statut compte |
| Commerces | `/commerces` | validate / reject |
| Offres paginées | `/offres` | deactivate / withdraw |

## Démarrage

```bash
# backend
cd backend && python run.py

# app (port 5173)
cd frontend-app && pnpm dev

# admin (port 5174)
cd frontend-admin && pnpm dev
```

Variables : `VITE_API_URL=http://127.0.0.1:5000` dans chaque `.env`.