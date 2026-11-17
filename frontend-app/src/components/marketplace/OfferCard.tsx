import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { ConsumerOffer } from '../../lib/api/types'
import { Icon } from '../icons/Icon'
import { cn } from '../../lib/utils/cn'

type OfferCardProps = {
  offer: ConsumerOffer
  offerBasePath?: string
  variant?: 'default' | 'marketplace'
}

function pseudoRating(offerId: number) {
  const base = 4 + (offerId % 3) * 0.15
  return Math.min(5, Math.round(base * 10) / 10)
}

export function OfferCard({ offer, offerBasePath = '/espace/offres', variant = 'default' }: OfferCardProps) {
  const productName = offer.product?.name ?? `Offre #${offer.id}`
  const storeName = offer.store?.name ?? 'Commerce partenaire'
  const category = offer.product?.category_name ?? 'Anti gaspi'
  const [fav, setFav] = useState(false)
  const rating = pseudoRating(offer.id)
  const reviewCount = 12 + (offer.id % 48)

  if (variant === 'marketplace') {
    return (
      <article className="group relative overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
        <button
          type="button"
          onClick={() => setFav((f) => !f)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Icon
            name="heart"
            className={cn('h-4 w-4', fav ? 'fill-gbandjo-orange stroke-gbandjo-orange text-gbandjo-orange' : 'text-gbandjo-muted')}
          />
        </button>
        <Link to={`${offerBasePath}/${offer.id}`} className="block">
          <div className="flex h-44 items-center justify-center bg-gradient-to-b from-gbandjo-surface to-white p-4">
            {offer.product?.image_url ? (
              <img src={offer.product.image_url} alt="" className="max-h-full max-w-full object-contain transition group-hover:scale-105" />
            ) : (
              <Icon name="image" className="h-14 w-14 text-gbandjo-green/40" />
            )}
          </div>
        </Link>
        <div className="space-y-1.5 p-4 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gbandjo-muted">{category}</p>
          <Link to={`${offerBasePath}/${offer.id}`}>
            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-gbandjo-ink hover:text-gbandjo-green">{productName}</h3>
          </Link>
          <p className="text-xs text-gbandjo-muted line-clamp-1">{storeName}</p>
          <div className="flex items-center gap-1 text-gbandjo-orange">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                name="star"
                className={cn('h-3.5 w-3.5', i < Math.floor(rating) ? 'fill-gbandjo-orange stroke-gbandjo-orange' : 'stroke-gbandjo-orange/30')}
              />
            ))}
            <span className="ml-1 text-xs font-medium text-gbandjo-muted">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 pt-1">
            <div>
              <span className="text-lg font-extrabold text-gbandjo-ink">{offer.discounted_price} €</span>
              <span className="ml-2 text-sm text-gbandjo-muted line-through">{offer.initial_price} €</span>
              <span className="ml-1 text-xs font-bold text-gbandjo-orange">−{offer.discount_percentage}%</span>
            </div>
            <Link
              to={`${offerBasePath}/${offer.id}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gbandjo-border bg-gbandjo-surface text-gbandjo-green transition hover:border-gbandjo-green hover:bg-gbandjo-green hover:text-white"
              aria-label="Réserver cette offre"
            >
              <Icon name="reservations" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-gbandjo-green-light to-white">
        {offer.product?.image_url ? (
          <img src={offer.product.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon name="image" className="h-12 w-12 text-gbandjo-green/50" title="Illustration produit" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-gbandjo-orange px-2 py-0.5 text-xs font-bold text-white">
          −{offer.discount_percentage}%
        </span>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gbandjo-muted">{category}</p>
        <h3 className="line-clamp-2 text-base font-bold text-gbandjo-ink">{productName}</h3>
        <p className="text-sm text-gbandjo-muted">
          {storeName}
          {offer.distance_km != null ? (
            <span className="ml-1 text-gbandjo-green">({offer.distance_km.toFixed(1)} km)</span>
          ) : null}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-gbandjo-green">{offer.discounted_price} €</span>
          <span className="text-sm text-gbandjo-muted line-through">{offer.initial_price} €</span>
        </div>
        <Link
          to={`${offerBasePath}/${offer.id}`}
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gbandjo-green py-2.5 text-sm font-semibold text-white transition group-hover:bg-gbandjo-green-dark"
        >
          Voir l&apos;offre
        </Link>
      </div>
    </article>
  )
}