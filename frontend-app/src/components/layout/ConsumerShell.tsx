import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { catalogCategoryQueryKey } from '../../lib/hooks/useCatalog'
import { queryClient } from '../../lib/query/queryClient'
import { fetchCategories, fetchOffers } from '../../lib/services/catalogService'

import { InstallPrompt } from '../pwa/InstallPrompt'
import { ConsumerPageEnd } from './consumer/ConsumerPageEnd'
import { ConsumerTopBar } from './consumer/ConsumerTopBar'
import { ConsumerSearchContext } from './consumer/consumer-search-context'

export function ConsumerShell() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: catalogCategoryQueryKey,
      queryFn: fetchCategories,
      staleTime: 5 * 60_000,
    })
    void queryClient.prefetchQuery({
      queryKey: ['catalog', 'offers', { page: 1, per_page: 48 }],
      queryFn: () => fetchOffers({ page: 1, per_page: 48 }),
      staleTime: 45_000,
    })
  }, [])

  return (
    <ConsumerSearchContext.Provider value={{ query, setQuery }}>
    <div className="flex min-h-svh flex-col bg-[#f5f6f8]">
      <ConsumerTopBar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:py-8">
        <Outlet />
      </main>
      <ConsumerPageEnd />
      <InstallPrompt />
    </div>
    </ConsumerSearchContext.Provider>
  )
}