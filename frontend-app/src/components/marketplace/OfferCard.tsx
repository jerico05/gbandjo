import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { ConsumerOffer } from '../../lib/api/types'
import { formatFcfa } from '../../lib/utils/formatMoney'
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
      <article className="group relative overflow-hidden rounded-xl border border-gbandjo-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:rounded-2xl">
        <button
          type="button"
          onClick={() => setFav((f) => !f)}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Icon
            name="heart"
            className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', fav ? 'fill-gbandjo-orange stroke-gbandjo-orange text-gbandjo-orange' : 'text-gbandjo-muted')}
          />
        </button>
        <Link to={`${offerBasePath}/${offer.id}`} className="block">
          <div className="flex h-28 items-center justify-center bg-gradient-to-b from-gbandjo-surface to-white p-2 sm:h-44 sm:p-4">
            {offer.product?.image_url ? (
              <img src={offer.product.image_url} alt="" className="max-h-full max-w-full object-contain transition group-hover:scale-105" />
            ) : (
              <Icon name="image" className="h-10 w-10 text-gbandjo-green/40 sm:h-14 sm:w-14" />
            )}
          </div>
        </Link>
        <div className="space-y-1 p-2.5 pt-2 sm:space-y-1.5 sm:p-4 sm:pt-3">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-gbandjo-muted sm:text-[11px]">{category}</p>
          <Link to={`${offerBasePath}/${offer.id}`}>
            <h3 className="line-clamp-2 min-h-[2.25rem] text-xs font-bold text-gbandjo-ink hover:text-gbandjo-green sm:min-h-[2.5rem] sm:text-sm">
              {productName}
            </h3>
          </Link>
          <p className="truncate text-[11px] text-gbandjo-muted sm:text-xs">{storeName}</p>
          <div className="hidden items-center gap-1 text-gbandjo-orange sm:flex">
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
          <div className="flex items-end justify-between gap-1.5 pt-1">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-gbandjo-ink sm:text-lg">{formatFcfa(offer.discounted_price)}</p>
              <p className="truncate text-[10px] text-gbandjo-muted line-through sm:text-sm">{formatFcfa(offer.initial_price)}</p>
              <span className="text-[10px] font-bold text-gbandjo-orange sm:text-xs">−{offer.discount_percentage}%</span>
            </div>
            <Link
              to={`${offerBasePath}/${offer.id}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gbandjo-border bg-gbandjo-surface text-gbandjo-green transition hover:border-gbandjo-green hover:bg-gbandjo-green hover:text-white sm:h-10 sm:w-10 sm:rounded-xl"
              aria-label="Réserver cette offre"
            >
              <Icon name="reservations" className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group overflow-hidden rounded-xl border border-gbandjo-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl">
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-gbandjo-green-light to-white sm:h-40">
        {offer.product?.image_url ? (
          <img src={offer.product.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon name="image" className="h-10 w-10 text-gbandjo-green/50 sm:h-12 sm:w-12" title="Illustration produit" />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-gbandjo-orange px-1.5 py-0.5 text-[10px] font-bold text-white sm:left-3 sm:top-3 sm:px-2 sm:text-xs">
          −{offer.discount_percentage}%
        </span>
      </div>
      <div className="space-y-1.5 p-2.5 sm:space-y-2 sm:p-4">
        <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gbandjo-muted sm:text-xs">{category}</p>
        <h3 className="line-clamp-2 text-sm font-bold text-gbandjo-ink sm:text-base">{productName}</h3>
        <p className="truncate text-[11px] text-gbandjo-muted sm:text-sm">
          {storeName}
          {offer.distance_km != null ? (
            <span className="ml-1 text-gbandjo-green">({offer.distance_km.toFixed(1)} km)</span>
          ) : null}
        </p>
        <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
          <span className="text-base font-extrabold text-gbandjo-green sm:text-xl">{formatFcfa(offer.discounted_price)}</span>
          <span className="text-[11px] text-gbandjo-muted line-through sm:text-sm">{formatFcfa(offer.initial_price)}</span>
        </div>
        <Link
          to={`${offerBasePath}/${offer.id}`}
          className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-gbandjo-green py-2 text-xs font-semibold text-white transition group-hover:bg-gbandjo-green-dark sm:mt-2 sm:rounded-xl sm:py-2.5 sm:text-sm"
        >
          Voir l&apos;offre
        </Link>
      </div>
    </article>
  )
}