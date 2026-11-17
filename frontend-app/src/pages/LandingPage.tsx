import { useEffect, useState } from 'react'

import { MarketplaceServiceBar } from '../components/marketplace/MarketplaceServiceBar'
import { CategoriesSection } from '../components/marketing/CategoriesSection'
import { FeaturedOffersSection } from '../components/marketing/FeaturedOffersSection'
import { HeroSection } from '../components/marketing/HeroSection'
import { SolutionsSection } from '../components/marketing/SolutionsSection'
import { StepsSection } from '../components/marketing/StepsSection'
import type { Category, ConsumerOffer } from '../lib/api/types'
import { fetchCategories, fetchOffers } from '../lib/services/catalogService'

export function LandingPage() {
  const [offers, setOffers] = useState<ConsumerOffer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLiveData, setIsLiveData] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [offersResult, categoriesResult] = await Promise.all([
        fetchOffers(),
        fetchCategories().catch(() => []),
      ])
      if (cancelled) return
      setOffers(offersResult.offers)
      setIsLiveData(offersResult.source === 'api')
      setCategories(categoriesResult)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedOffersSection offers={offers} isLiveData={isLiveData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MarketplaceServiceBar />
      </div>
      <StepsSection />
      <SolutionsSection />
    </>
  )
}