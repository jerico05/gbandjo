import { Outlet } from 'react-router-dom'

import { InstallPrompt } from '../pwa/InstallPrompt'
import { PublicFooter } from './PublicFooter'
import { PublicHeader } from './PublicHeader'

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-[#f5f6f8]">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6">
        <Outlet />
      </main>
      <PublicFooter />
      <InstallPrompt />
    </div>
  )
}