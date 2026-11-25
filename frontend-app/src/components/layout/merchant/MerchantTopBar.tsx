import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Icon } from '../../icons/Icon'
import { logout } from '../../../lib/services/authService'
import { fetchUnreadCount } from '../../../lib/services/notificationService'
import { useAuthStore } from '../../../stores/authStore'

type MerchantTopBarProps = {
  onSidebarToggle?: () => void
}

export function MerchantTopBar({ onSidebarToggle }: MerchantTopBarProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const clearSession = useAuthStore((s) => s.clearSession)
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void fetchUnreadCount()
      .then(setUnread)
      .catch(() => setUnread(0))
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function handleLogout() {
    if (refreshToken) {
      try {
        await logout(refreshToken)
      } catch {
        /* ignore */
      }
    }
    clearSession()
    navigate('/connexion', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gbandjo-border bg-white/95 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-xl border border-gbandjo-border p-2 text-gbandjo-muted lg:hidden"
          aria-label="Ouvrir le menu"
          onClick={onSidebarToggle}
        >
          <Icon name="list" className="h-5 w-5" />
        </button>

        <p className="min-w-0 truncate text-sm font-bold text-gbandjo-ink lg:hidden">Mon commerce</p>

        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border border-gbandjo-border bg-gbandjo-surface px-4 py-2.5 md:flex">
          <Icon name="search" className="h-4 w-4 shrink-0 text-gbandjo-muted" />
          <input
            type="search"
            placeholder="Rechercher dans la boutique…"
            className="w-full max-w-xl bg-transparent text-sm outline-none placeholder:text-gbandjo-muted"
            aria-label="Recherche boutique"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/mon-commerce/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gbandjo-border text-gbandjo-muted transition hover:border-gbandjo-green/40 hover:text-gbandjo-green"
            aria-label="Notifications"
          >
            <Icon name="bell" className="h-5 w-5" />
            {unread > 0 ? (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            ) : null}
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-2xl border border-gbandjo-border py-1 pl-1 pr-2 transition hover:border-gbandjo-green/30 sm:pr-3"
              aria-expanded={menuOpen}
              aria-label="Menu compte"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gbandjo-green text-sm font-bold text-white sm:h-9 sm:w-9">
                {user?.first_name?.[0] ?? 'C'}
              </span>
              <span className="hidden max-w-[120px] truncate text-sm font-semibold text-gbandjo-ink sm:block">
                {user ? `${user.first_name} ${user.last_name}` : 'Commerçant'}
              </span>
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gbandjo-border bg-white py-1 shadow-lg">
                <Link
                  to="/"
                  className="block px-4 py-2.5 text-sm font-medium text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  to="/mon-commerce"
                  className="block px-4 py-2.5 text-sm text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
                <Link
                  to="/mon-commerce/notifications"
                  className="block px-4 py-2.5 text-sm text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMenuOpen(false)}
                >
                  Notifications {unread > 0 ? `(${unread})` : ''}
                </Link>
                <Link
                  to="/mon-commerce/parametres"
                  className="block px-4 py-2.5 text-sm text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMenuOpen(false)}
                >
                  Paramètres
                </Link>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="w-full border-t px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Déconnexion
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}