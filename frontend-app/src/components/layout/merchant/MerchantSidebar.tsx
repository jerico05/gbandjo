import { NavLink } from 'react-router-dom'

import { LogoGbandjo } from '../../branding/LogoGbandjo'
import { Icon } from '../../icons/Icon'
import { cn } from '../../../lib/utils/cn'
import type { IconName } from '../../icons/Icon'

type NavItem = {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

const principal: NavItem[] = [
  { to: '/mon-commerce', label: 'Tableau de bord', icon: 'dashboard', end: true },
  { to: '/mon-commerce/reservations', label: 'Réservations', icon: 'reservations' },
  { to: '/mon-commerce/notifications', label: 'Notifications', icon: 'bell' },
]

const tools: NavItem[] = [
  { to: '/mon-commerce/produits', label: 'Produits', icon: 'products' },
  { to: '/mon-commerce/offres', label: 'Offres', icon: 'offers' },
]

const settings: NavItem[] = [
  { to: '/mon-commerce/parametres', label: 'Paramètres', icon: 'settings' },
  { to: '/', label: 'Accueil', icon: 'home' },
]

type MerchantSidebarProps = {
  className?: string
  onNavigate?: () => void
}

function NavSection({ title, items, onNavigate }: { title: string; items: NavItem[]; onNavigate?: () => void }) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gbandjo-muted">{title}</p>
      <nav className="flex flex-col gap-1">
        {items.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-gbandjo-green text-white shadow-md shadow-gbandjo-green/20'
                  : 'text-gbandjo-muted hover:bg-white hover:text-gbandjo-green-dark',
              )
            }
          >
            <Icon name={link.icon} className="h-5 w-5 shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function MerchantSidebar({ className, onNavigate }: MerchantSidebarProps) {
  return (
    <aside
      className={cn(
        'flex w-64 shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-gbandjo-border bg-white p-5 shadow-sm',
        'h-full lg:h-svh',
        className,
      )}
    >
      <LogoGbandjo className="mb-8" variant="compact" />
      <NavSection title="Principal" items={principal} onNavigate={onNavigate} />
      <NavSection title="Outils" items={tools} onNavigate={onNavigate} />
      <div className="mt-auto border-t border-gbandjo-border/80 pt-4">
        <NavSection title="Paramètres" items={settings} onNavigate={onNavigate} />
      </div>
    </aside>
  )
}