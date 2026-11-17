import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { LogoGbandjoAdmin } from '../components/branding/LogoGbandjoAdmin'
import { Icon } from '../components/icons/Icon'
import { AdminTopBar } from '../components/layout/AdminTopBar'
import { cn } from '../lib/utils/cn'

const links: Array<{ to: string; label: string; icon: 'layout' | 'users' | 'store' | 'tag' }> = [
  { to: '/tableau-de-bord', label: 'Tableau de bord', icon: 'layout' },
  { to: '/utilisateurs', label: 'Utilisateurs', icon: 'users' },
  { to: '/commerces', label: 'Commerces', icon: 'store' },
  { to: '/offres', label: 'Offres', icon: 'tag' },
]

const titles: Record<string, string> = {
  '/tableau-de-bord': 'Tableau de bord',
  '/utilisateurs': 'Utilisateurs',
  '/commerces': 'Validation des commerces',
  '/offres': 'Modération des offres',
}

export function AdminDashboardShell() {
  const { pathname } = useLocation()
  const pageTitle = titles[pathname] ?? 'Administration'

  return (
    <div className="flex min-h-svh bg-gbandjo-surface">
      <aside className="flex w-64 shrink-0 flex-col bg-[#1e293b] text-slate-200">
        <div className="border-b border-white/10 bg-white px-5 py-5">
          <LogoGbandjoAdmin variant="sidebar" />
        </div>
        <p className="px-5 pt-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Menu</p>
        <nav className="flex flex-col gap-1 px-3 py-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-gbandjo-blue text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <Icon name={link.icon} className="h-5 w-5 shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 p-4 text-xs text-slate-500">
          Espace réservé aux administrateurs Gbandjo
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar title={pageTitle} breadcrumb="Tableau de bord / Admin" />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}