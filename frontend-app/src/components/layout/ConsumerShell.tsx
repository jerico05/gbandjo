import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { InstallPrompt } from '../pwa/InstallPrompt'
import { ConsumerBottomNav } from './consumer/ConsumerBottomNav'
import { ConsumerMarketplaceFooter } from './consumer/ConsumerMarketplaceFooter'
import { ConsumerTopBar } from './consumer/ConsumerTopBar'
import { ConsumerSearchContext } from './consumer/consumer-search-context'

export function ConsumerShell() {
  const [query, setQuery] = useState('')

  return (
    <ConsumerSearchContext.Provider value={{ query, setQuery }}>
    <div className="min-h-svh bg-[#f5f6f8]">
      <ConsumerTopBar />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:pb-10">
        <Outlet />
      </main>
      <ConsumerMarketplaceFooter />
      <ConsumerBottomNav />
      <InstallPrompt />
    </div>
    </ConsumerSearchContext.Provider>
  )
}