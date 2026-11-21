import { Link } from 'react-router-dom'

import type { ConsumerOffer } from '../../lib/api/types'
import { formatFcfa } from '../../lib/utils/formatMoney'
import { Icon } from '../icons/Icon'

type MarketplacePromoTilesProps = {
  offers: ConsumerOffer[]
  offerBasePath: string
}

export function MarketplacePromoTiles({ offers, offerBasePath }: MarketplacePromoTilesProps) {
  if (offers.length === 0) return null

  const sorted = [...offers].sort((a, b) => Number(b.discount_percentage) - Number(a.discount_percentage))
  const deal = sorted[0]
  const fresh = sorted[1] ?? sorted[0]
  const member = sorted[2] ?? sorted[0]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      <Link
        to={`${offerBasePath}/${deal.id}`}
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5 transition hover:shadow-md"
      >
        <div>
          <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-rose-700">
            Deal du jour
          </span>
          <p className="mt-2 text-lg font-extrabold text-gbandjo-ink line-clamp-2">
            −{deal.discount_percentage}% sur {deal.product?.name ?? 'l’offre flash'}
          </p>
          <p className="mt-1 text-sm text-gbandjo-muted">{formatFcfa(deal.discounted_price)}</p>
        </div>
        {deal.product?.image_url ? (
          <img
            src={deal.product.image_url}
            alt=""
            className="pointer-events-none absolute bottom-2 right-2 h-24 w-24 rounded-xl object-cover opacity-90 shadow-md transition group-hover:scale-105"
          />
        ) : (
          <Icon name="bag" className="absolute bottom-4 right-4 h-16 w-16 text-rose-200" />
        )}
      </Link>

      <Link
        to={`${offerBasePath}/${fresh.id}`}
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 transition hover:shadow-md"
      >
        <div>
          <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-sky-800">
            Nouveautés
          </span>
          <p className="mt-2 text-lg font-extrabold text-gbandjo-ink line-clamp-2">{fresh.store?.name ?? 'Commerce'}</p>
          <p className="mt-1 text-sm font-semibold text-gbandjo-green">Explorer →</p>
        </div>
        {fresh.product?.image_url ? (
          <img
            src={fresh.product.image_url}
            alt=""
            className="pointer-events-none absolute bottom-2 right-2 h-24 w-24 rounded-xl object-cover opacity-90 shadow-md transition group-hover:scale-105"
          />
        ) : (
          <Icon name="sparkle" className="absolute bottom-4 right-4 h-16 w-16 text-sky-200" />
        )}
      </Link>

      <Link
        to={`${offerBasePath}/${member.id}`}
        className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl border border-gbandjo-green-dark bg-gradient-to-br from-gbandjo-ink to-gbandjo-green-dark p-5 text-white transition hover:shadow-lg"
      >
        <div>
          <span className="inline-flex rounded-full bg-gbandjo-orange px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
            Exclusif membres
          </span>
          <p className="mt-2 text-lg font-extrabold line-clamp-2">
            Jusqu&apos;à −{member.discount_percentage}% sur les paniers invendus
          </p>
          <p className="mt-1 text-sm text-white/80">Réservé aux comptes Gbandjo</p>
        </div>
        <span className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-gbandjo-orange/90 text-lg font-black">
          %
        </span>
      </Link>
    </div>
  )
}