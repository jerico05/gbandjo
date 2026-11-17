import { Icon } from '../../icons/Icon'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import type { MerchantOffer } from '../../../lib/api/types'

type MerchantOfferMarketCardProps = {
  offer: MerchantOffer
  onDeactivate?: () => void
  onWithdraw?: () => void
}

export function MerchantOfferMarketCard({ offer, onDeactivate, onWithdraw }: MerchantOfferMarketCardProps) {
  const isActive = offer.status === 'ACTIVE'

  return (
    <article className="overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative bg-gradient-to-br from-gbandjo-orange/20 via-gbandjo-green-light to-white px-4 pb-4 pt-5">
        {isActive ? (
          <Badge tone="orange" className="absolute left-4 top-4">
            −{offer.discount_percentage}%
          </Badge>
        ) : (
          <Badge tone="neutral" className="absolute left-4 top-4">
            {offer.status}
          </Badge>
        )}
        <span className="mt-8 flex h-20 items-center justify-center">
          <Icon name="offers" className="h-14 w-14 text-gbandjo-green/50" />
        </span>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-bold text-gbandjo-ink">
          {offer.product_name ?? `Produit #${offer.product_id}`}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-gbandjo-green">{offer.discounted_price} €</span>
          <span className="text-sm text-gbandjo-muted line-through">{offer.initial_price} €</span>
        </div>
        <p className="text-xs text-gbandjo-muted">
          Stock : {offer.available_quantity}, fin le {new Date(offer.ends_at).toLocaleDateString('fr-FR')}
        </p>
        {isActive && (onDeactivate || onWithdraw) ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {onDeactivate ? (
              <Button type="button" variant="outline" className="!py-2 text-xs" onClick={onDeactivate}>
                Désactiver
              </Button>
            ) : null}
            {onWithdraw ? (
              <Button type="button" variant="ghost" className="!py-2 text-xs" onClick={onWithdraw}>
                Retirer
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}