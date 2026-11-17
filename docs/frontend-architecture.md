# Architecture frontend Gbandjo

## Applications

| Dossier | Audience | Port dev (défaut) |
|---------|----------|---------------------|
| `frontend-app` | Consommateur + commerçant (rôle JWT) | 5173 |
| `frontend-admin` | Administrateurs | 5174 |

Les deux consomment l’API Flask (`structure.md`) via `VITE_API_URL`. En dev, un proxy Vite redirige `/api` vers le backend.

## `frontend-app` — arborescence

```
src/
├── components/
│   ├── branding/       # Logo
│   ├── layout/         # Header, footer, shells commerçant
│   ├── marketing/      # Sections landing
│   ├── marketplace/    # Cartes offres, filtres
│   └── ui/             # Button, Container, Badge
├── lib/
│   ├── api/            # client Axios, types enveloppe API
│   └── services/       # offres, catégories
├── pages/              # Une page par route principale
├── routes/             # React Router, gardes de rôle
├── stores/             # Zustand (auth)
└── data/mock/          # Repli si API indisponible
```

## Routage (cible `agent.MD`)

- Public : `/`, `/offres`, `/connexion`, `/inscription`
- Consommateur : `/reservations`, `/notifications`, `/profil`
- Commerçant : `/mon-commerce/*`

## Identité

- **Utilisateur** : `public/logo-gbandjo.png` (fichier source à la racine du dépôt)
- **Admin** : `public/logo-gbandjo-admin.png`
- Icônes UI : composant `Icon` (traits SVG, pas d’emojis)

## Communication API

Réponses normalisées : `{ data, message, errors }`. Le client Axios lit `data` et propage les erreurs 401 vers rafraîchissement JWT (à compléter sur les écrans auth).