import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { catalogCategoryQueryKey } from '../../lib/hooks/useCatalog'
import { merchantKeys } from '../../lib/hooks/useMerchant'
import { fetchCategories } from '../../lib/services/catalogService'
import { queryClient } from '../../lib/query/queryClient'
import { listMerchantOffers } from '../../lib/services/merchantOfferService'
import { listProducts } from '../../lib/services/merchantProductService'
import { listMerchantReservations } from '../../lib/services/reservationService'
import { fetchMyStore } from '../../lib/services/storeService'
import { InstallPrompt } from '../pwa/InstallPrompt'
import { MerchantSidebar } from './merchant/MerchantSidebar'
import { MerchantTopBar } from './merchant/MerchantTopBar'

export function MerchantShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const prefetch = <T,>(queryKey: readonly unknown[], queryFn: () => Promise<T>, staleTime: number) =>
      void queryClient.prefetchQuery({ queryKey, queryFn, staleTime })

    prefetch(catalogCategoryQueryKey, fetchCategories, 5 * 60_000)
    prefetch(merchantKeys.store, fetchMyStore, 2 * 60_000)
    prefetch(merchantKeys.products, listProducts, 60_000)
    prefetch(merchantKeys.offers, listMerchantOffers, 60_000)
    prefetch(merchantKeys.reservations, listMerchantReservations, 45_000)
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileNavOpen])

  return (
    <div className="min-h-svh bg-[#f3f5f9]">
      <MerchantSidebar className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex" />
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer le menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <MerchantSidebar
            className="relative z-10 h-full max-w-[85vw] shadow-2xl sm:max-w-xs"
            onNavigate={() => setMobileNavOpen(false)}
          />
        </div>
      ) : null}

      <div className="flex min-h-svh min-w-0 flex-col lg:ml-64">
        <MerchantTopBar onSidebarToggle={() => setMobileNavOpen((o) => !o)} />
        <main className="flex-1 px-3 py-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <InstallPrompt />
    </div>
  )
}