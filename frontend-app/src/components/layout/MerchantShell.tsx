import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { MerchantPromoBar } from '../merchant/marketplace/MerchantPromoBar'
import { MerchantSidebar } from './merchant/MerchantSidebar'
import { MerchantTopBar } from './merchant/MerchantTopBar'

export function MerchantShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-svh bg-[#f3f5f9]">
      <MerchantSidebar className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex" />
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer le menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <MerchantSidebar
            className="relative z-10 h-full shadow-xl"
            onNavigate={() => setMobileNavOpen(false)}
          />
        </div>
      ) : null}

      <div className="flex min-h-svh min-w-0 flex-col lg:ml-64">
        <MerchantPromoBar />
        <MerchantTopBar onSidebarToggle={() => setMobileNavOpen((o) => !o)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}