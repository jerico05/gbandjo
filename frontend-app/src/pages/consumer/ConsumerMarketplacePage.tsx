import { ConsumerOffersExplorer } from '../../components/marketplace/ConsumerOffersExplorer'

export function ConsumerMarketplacePage() {
  return (
    <section id="catalogue" className="space-y-6 sm:space-y-8">
      <ConsumerOffersExplorer offerBasePath="/espace/offres" layout="marketplace" />
    </section>
  )
}
