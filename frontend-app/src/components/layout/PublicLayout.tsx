import { Outlet, useLocation } from 'react-router-dom'

import { cn } from '../../lib/utils/cn'
import { InstallPrompt } from '../pwa/InstallPrompt'
import { PublicFooter } from './PublicFooter'
import { PublicHeader } from './PublicHeader'

export function PublicLayout() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div className="flex min-h-svh flex-col bg-[#f5f6f8]">
      <PublicHeader />
      <main
        className={cn(
          'flex w-full flex-1 flex-col',
          isLanding ? 'mx-auto max-w-none' : 'mx-auto max-w-7xl px-4 sm:px-6',
        )}
      >
        <Outlet />
      </main>
      {isLanding ? (
        <div className="hidden md:block">
          <PublicFooter />
        </div>
      ) : null}
      <InstallPrompt />
    </div>
  )
}
