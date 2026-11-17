import { ConsumerOffersExplorer } from '../../components/marketplace/ConsumerOffersExplorer'
import { MarketplaceHero } from '../../components/marketplace/MarketplaceHero'
import { MarketplaceNewsletter } from '../../components/marketplace/MarketplaceNewsletter'
import { MarketplaceServiceBar } from '../../components/marketplace/MarketplaceServiceBar'
import { useAuthStore } from '../../stores/authStore'

export function ConsumerMarketplacePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-8">
      <MarketplaceHero firstName={user?.first_name} />

      <section id="catalogue" className="space-y-8">
        <ConsumerOffersExplorer offerBasePath="/espace/offres" layout="marketplace" />
      </section>

      <MarketplaceServiceBar />
      <MarketplaceNewsletter />
    </div>
  )
}