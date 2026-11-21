import { ConsumerOffersExplorer } from '../../components/marketplace/ConsumerOffersExplorer'
import { MarketplaceNewsletter } from '../../components/marketplace/MarketplaceNewsletter'
import { MarketplaceServiceBar } from '../../components/marketplace/MarketplaceServiceBar'

export function ConsumerMarketplacePage() {
  return (
    <div className="space-y-8">
      <section id="catalogue" className="space-y-8">
        <ConsumerOffersExplorer offerBasePath="/espace/offres" layout="marketplace" />
      </section>

      <MarketplaceServiceBar />
      <MarketplaceNewsletter />
    </div>
  )
}