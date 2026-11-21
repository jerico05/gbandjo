import { NavLink } from 'react-router-dom'

import { LogoGbandjoAdmin } from '../branding/LogoGbandjoAdmin'
import { Icon } from '../icons/Icon'
import { cn } from '../../lib/utils/cn'

const links: Array<{ to: string; label: string; icon: 'layout' | 'users' | 'store' | 'tag' }> = [
  { to: '/tableau-de-bord', label: 'Tableau de bord', icon: 'layout' },
  { to: '/utilisateurs', label: 'Utilisateurs', icon: 'users' },
  { to: '/commerces', label: 'Commerces', icon: 'store' },
  { to: '/offres', label: 'Offres', icon: 'tag' },
]

type AdminSidebarProps = {
  className?: string
  onNavigate?: () => void
}

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  return (
    <aside className={cn('flex h-full w-64 shrink-0 flex-col bg-[#0f172a] text-slate-200', className)}>
      <div className="border-b border-white/10 px-5 py-5">
        <LogoGbandjoAdmin variant="sidebar" />
      </div>
      <p className="px-5 pt-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Navigation</p>
      <nav className="flex flex-col gap-1 px-3 py-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                isActive
                  ? 'bg-gbandjo-blue text-white shadow-lg shadow-gbandjo-blue/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon name={link.icon} className="h-5 w-5 shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/10 p-5">
        <p className="text-xs leading-relaxed text-slate-500">
          Console d&apos;administration Gbandjo. Validez les commerces et modérez le marketplace anti gaspi.
        </p>
      </div>
    </aside>
  )
}