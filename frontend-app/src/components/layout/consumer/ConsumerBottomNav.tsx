import { NavLink } from 'react-router-dom'

import { Icon, type IconName } from '../../icons/Icon'
import { cn } from '../../../lib/utils/cn'
import { fetchUnreadCount } from '../../../lib/services/notificationService'
import { useEffect, useState } from 'react'

const links: Array<{ to: string; label: string; icon: IconName; end?: boolean }> = [
  { to: '/espace', label: 'Accueil', icon: 'home', end: true },
  { to: '/espace/reservations', label: 'Réservations', icon: 'reservations' },
  { to: '/espace/notifications', label: 'Alertes', icon: 'bell' },
  { to: '/espace/profil', label: 'Compte', icon: 'user' },
]

export function ConsumerBottomNav() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    void fetchUnreadCount()
      .then(setUnread)
      .catch(() => setUnread(0))
  }, [])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gbandjo-border bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
      aria-label="Navigation consommateur"
    >
      <ul className="mx-auto flex max-w-lg items-center justify-around">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'relative flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold',
                  isActive ? 'text-gbandjo-green' : 'text-gbandjo-muted',
                )
              }
            >
              <Icon name={link.icon} className="h-5 w-5" />
              {link.label}
              {link.to.includes('notifications') && unread > 0 ? (
                <span className="absolute right-1 top-0 h-2 w-2 rounded-full bg-red-500" />
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}