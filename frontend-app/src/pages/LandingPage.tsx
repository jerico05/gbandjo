import { MarketplaceServiceBar } from '../components/marketplace/MarketplaceServiceBar'
import { CategoriesSection } from '../components/marketing/CategoriesSection'
import { FeaturedOffersSection } from '../components/marketing/FeaturedOffersSection'
import { HeroSection } from '../components/marketing/HeroSection'
import { SolutionsSection } from '../components/marketing/SolutionsSection'
import { StepsSection } from '../components/marketing/StepsSection'
import { useCategories, useFeaturedOffers } from '../lib/hooks/useCatalog'

export function LandingPage() {
  const categoriesQuery = useCategories()
  const offersQuery = useFeaturedOffers(8)

  const categories = categoriesQuery.data ?? []
  const offers = offersQuery.data?.offers ?? []
  const isLiveData = offersQuery.data?.source === 'api'

  return (
    <div className="w-full">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedOffersSection offers={offers} isLiveData={isLiveData} isLoading={offersQuery.isLoading} />
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8">
        <MarketplaceServiceBar />
      </div>
      <StepsSection />
      <SolutionsSection />
    </div>
  )
}
