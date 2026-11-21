# Audit performance backend Gbandjo

Dernière mise à jour : novembre 2025.

## Synthèse

| Zone | État avant | Action |
|------|-----------|--------|
| Liste offres publiques | Toutes les lignes, gros JSON | Pagination + payload carte |
| `image_url` | Absent (frontend attendait ce champ) | Ajout + 1re image produit |
| Filtre `min_discount` | En Python après SELECT | Filtre SQL |
| Catégories | 1 requête à chaque hit | Cache mémoire 120 s |
| Eager loading offres | Déjà `joinedload` / `selectinload` | Conserver |
| Neon / pool | `pool_pre_ping` actif | OK |
| Détail offre | `commit` si expiration | Acceptable à faible volume |

## Points d’attention (à moyen terme)

1. **Index SQL** : ajouter un index composite catalogue (`statut`, `date_fin`, `quantite_disponible`) si le volume dépasse quelques milliers d’offres.
2. **Expiration offres** : job cron `POST /api/internal/...` plutôt que mise à jour au GET détail.
3. **Suppression image** : retirer aussi l’asset Cloudinary.
4. **Frontend** : éviter le repli mock silencieux sur erreur API (logs + message utilisateur).
5. **Compression** : activer gzip au reverse proxy (prod).

## API catalogue (après correctifs)

`GET /api/offers`

- `page`, `per_page` (défaut 48, max 100)
- Réponse : `{ offers, pagination: { page, per_page, total, total_pages } }`
- Liste : champs allégés (`product.image_url`, pas de liste `images` complète)

`GET /api/offers/:id` : détail complet inchangé + `product.image_url`.

## Vérification locale

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
flask --app run run
# GET http://127.0.0.1:5000/api/offers?page=1&per_page=24
# GET http://127.0.0.1:5000/api/categories
```