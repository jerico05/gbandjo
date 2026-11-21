import { useEffect } from 'react'

import { MarketplaceServiceBar } from '../components/marketplace/MarketplaceServiceBar'
import { CategoriesSection } from '../components/marketing/CategoriesSection'
import { FeaturedOffersSection } from '../components/marketing/FeaturedOffersSection'
import { HeroSection } from '../components/marketing/HeroSection'
import { SolutionsSection } from '../components/marketing/SolutionsSection'
import { StepsSection } from '../components/marketing/StepsSection'
import { useCategories, useFeaturedOffers } from '../lib/hooks/useCatalog'
import { logoutCurrentSession } from '../lib/services/sessionLogout'
import { useAuthStore } from '../stores/authStore'

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.user || s.accessToken || s.refreshToken))

  useEffect(() => {
    if (!isAuthenticated) return
    void logoutCurrentSession()
  }, [isAuthenticated])

  const categoriesQuery = useCategories()
  const offersQuery = useFeaturedOffers(8)

  const categories = categoriesQuery.data ?? []
  const offers = offersQuery.data?.offers ?? []
  const isLiveData = offersQuery.data?.source === 'api'

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedOffersSection offers={offers} isLiveData={isLiveData} isLoading={offersQuery.isLoading} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MarketplaceServiceBar />
      </div>
      <StepsSection />
      <SolutionsSection />
    </>
  )
}