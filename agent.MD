Voici le plan de développement complet. Il est organisé par phase, du backend terminé jusqu'aux deux frontends.

---

## Plan de développement — Projet Gbandjo

### Structure du dépôt

```
gbandjo/
├── backend/          ← Flask, SQLAlchemy, Alembic (déjà commencé)
├── frontend-app/     ← React PWA (consommateur + commerçant)
└── frontend-admin/   ← React (espace administrateur)
```

Les deux applications React communiquent avec le même backend via l'API REST. Elles sont déployées indépendamment.

---

## PHASE 1 — Backend Flask (API complète)

**Statut : modèles et migrations terminés. Reste : 7 modules.**

### Module 1 — Authentification et sécurité
- Inscription commerçant, inscription consommateur
- Connexion (retourne un JWT access token + refresh token)
- Rafraîchissement du token
- Déconnexion (révocation du refresh token)
- Décorateurs de contrôle d'accès : `@jwt_required`, `@role_requis(COMMERCANT)`, `@commerce_valide`
- Tests : connexion, mauvais mot de passe, compte suspendu, accès sans token, accès avec mauvais rôle

### Module 2 — Profil utilisateur
- Consulter son profil
- Modifier ses informations
- Modifier son mot de passe (vérifie l'ancien)
- Tests

### Module 3 — Commerces
- Commerçant : enregistrer, consulter, modifier son commerce
- Admin : lister toutes les demandes, valider, rejeter (avec motif)
- Tests : création, double commerce refusé (RG1), publication d'offre sans validation refusée (RG1)

### Module 4 — Produits et offres
- Commerçant : CRUD produits, gestion des images, publication d'offres, modification, désactivation, retrait
- Contrôles : prix, dates, date de péremption (RG4, RG5)
- Consommateur : lister les offres actives, recherche/filtres, tri par distance (Haversine), détail d'une offre
- Désactivation automatique à la consultation si l'offre est expirée ou épuisée
- Tests : chaque règle de validation, liste filtrée, tri par distance

### Module 5 — Réservations
- Consommateur : créer une réservation, lister les siennes, annuler
- Commerçant : lister les réservations de ses offres, confirmer (avec verrouillage FOR UPDATE), rejeter, marquer comme retirée, annuler après confirmation
- Nettoyage des réservations expirées : route interne `/internal/expirer-reservations` (appelable par cron ou manuellement) + contrôle à chaque accès
- Notifications générées à chaque changement de statut (RG16)
- Tests : RG9 à RG15, survente simultanée, expiration

### Module 6 — Notifications
- Lister ses notifications (paginées)
- Marquer une ou toutes comme lues
- Tests

### Module 7 — Administration
- Lister, filtrer les utilisateurs ; activer, suspendre, désactiver un compte
- Lister, filtrer, désactiver ou retirer des offres
- Statistiques globales (comptages par statut)
- Tests

### Transversal backend
- Pagination réutilisable
- Format de réponse JSON uniforme : `{"data": …, "message": …, "errors": …}`
- Gestion centralisée des erreurs (404, 422, 403, 500)
- Documentation OpenAPI avec Flask-SMOREST ou Flasgger
- Tests d'intégration de bout en bout (inscription → offre → réservation → confirmation)

---

## PHASE 2 — Frontend utilisateur (`frontend-app`)

Application React, PWA, partagée par le consommateur et le commerçant. L'espace affiché dépend du rôle dans le JWT.

### Technologies retenues
- **Vite** (bundler, rapide en développement)
- **React Router v6** (routage, routes protégées par rôle)
- **Axios** (appels API, intercepteur pour injecter le JWT et gérer l'expiration)
- **Zustand** (état global : utilisateur connecté, notifications)
- **Tailwind CSS** (mise en forme rapide, responsive)
- **Vite PWA plugin** (manifest, service worker)

### Structure des routes

```
/                        → Accueil (offres, non connecté)
/connexion               → Page de connexion
/inscription             → Choix du rôle puis formulaire

— Consommateur (protégé) —
/offres                  → Liste des offres avec filtres
/offres/:id              → Détail d'une offre
/reservations            → Mes réservations
/notifications           → Mes notifications
/profil                  → Mon profil

— Commerçant (protégé) —
/mon-commerce            → Tableau de bord commerçant
/mon-commerce/produits   → Mes produits
/mon-commerce/offres     → Mes offres
/mon-commerce/reservations → Réservations reçues
/profil                  → Mon profil
```

### Développement par écran

**Authentification**
- Page d'inscription (commerçant ou consommateur)
- Page de connexion
- Intercepteur Axios : rafraîchissement automatique du token, redirection si expiré

**Espace consommateur**
- Page d'accueil : grille d'offres, barre de recherche, filtres (catégorie, prix, réduction), tri par distance (géolocalisation du navigateur demandée avec l'accord de l'utilisateur)
- Page de détail d'une offre : images, prix, commerce, localisation
- Formulaire de réservation : sélection de la quantité, récapitulatif, soumission
- Page « Mes réservations » : liste avec statuts colorés, bouton d'annulation si EN_ATTENTE
- Page notifications : liste, marquer comme lue

**Espace commerçant**
- Tableau de bord : indicateurs (offres actives, réservations en attente, confirmées)
- Page « Mon commerce » : formulaire d'enregistrement, statut de validation
- Page produits : liste, ajout, modification
- Page offres : liste, publication, modification, désactivation
- Page réservations : liste avec statuts, confirmer, rejeter, marquer comme retirée
- Page profil

**PWA**
- Fichier `manifest.json` : nom, icônes, couleurs Gbandjo
- Service worker : cache des assets statiques (pas des données, qui changent en temps réel)
- Bouton « Installer l'application » si le navigateur le propose

---

## PHASE 3 — Frontend administrateur (`frontend-admin`)

Application React simple, sans exigence PWA, déployée sur une URL séparée. Accès réservé aux comptes avec le rôle ADMIN.

### Technologies retenues
- Vite + React Router v6 + Axios + Tailwind CSS
- **Tanstack Table** (tableaux triables et filtrables)
- **Recharts** (graphiques de statistiques)

### Structure des routes

```
/admin/connexion         → Connexion admin
/admin/tableau-de-bord   → Statistiques globales
/admin/utilisateurs      → Liste, recherche, actions (activer, suspendre, désactiver)
/admin/commerces         → Demandes en attente + tous les commerces, valider/rejeter
/admin/offres            → Toutes les offres, désactiver ou retirer
```

### Développement par écran

- Page de connexion (formulaire, vérification du rôle ADMIN côté client après réception du token)
- Tableau de bord : compteurs (utilisateurs, commerces validés, offres actives, réservations du jour) + graphique d'activité
- Page utilisateurs : tableau paginé, barre de recherche, menu d'actions par ligne
- Page commerces : onglet « En attente » en premier, formulaire de validation ou de rejet avec motif
- Page offres : tableau paginé, filtre par statut, action de désactivation ou retrait

---

## PHASE 4 — Tests et validation finale

- Compléter les tests Pytest backend (objectif : couvrir chaque route et chaque règle de gestion)
- Tests manuels de bout en bout : inscription → validation du commerce → publication d'offre → réservation → confirmation → retrait
- Test de la survente (deux réservations simultanées sur la dernière unité)
- Test de l'expiration (manipulation de la date d'expiration en base)
- Vérification responsive des deux frontends (mobile, tablette, desktop)
- Vérification de l'installation PWA sur Android

---

## PHASE 5 — Déploiement

| Composant | Service suggéré |
|---|---|
| Backend Flask | Render (plan gratuit, déploiement depuis Git) |
| Base PostgreSQL | Neon (déjà prévu) |
| `frontend-app` | Vercel ou Netlify |
| `frontend-admin` | Vercel ou Netlify (projet séparé) |

Variables d'environnement à configurer sur chaque service (jamais versionnées) : `DATABASE_URL`, `SECRET_KEY`, `VITE_API_URL`.

---