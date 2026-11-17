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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gbandjo-border bg-white px-4 shadow-sm sm:gap-4 sm:px-8">
      <button
        type="button"
        className="rounded-xl border border-gbandjo-border p-2 text-gbandjo-muted lg:hidden"
        aria-label="Menu"
        onClick={onSidebarToggle}
      >
        <Icon name="list" className="h-5 w-5" />
      </button>

      <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border border-gbandjo-border bg-gbandjo-surface px-4 py-2.5 md:flex">
        <Icon name="search" className="h-4 w-4 shrink-0 text-gbandjo-muted" />
        <input
          type="search"
          placeholder="Rechercher dans la boutique…"
          className="w-full max-w-xl bg-transparent text-sm outline-none placeholder:text-gbandjo-muted"
          aria-label="Recherche boutique"
        />
        <kbd className="hidden rounded-lg border border-gbandjo-border bg-white px-2 py-0.5 text-[10px] text-gbandjo-muted xl:inline">
          Ctrl K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
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

        <Link
          to="/mon-commerce/notifications"
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-gbandjo-border text-gbandjo-muted hover:text-gbandjo-green sm:flex"
          aria-label="Messages"
        >
          <Icon name="message" className="h-5 w-5" />
        </Link>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-2xl border border-gbandjo-border py-1.5 pl-1.5 pr-3 transition hover:border-gbandjo-green/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gbandjo-green text-sm font-bold text-white">
              {user?.first_name?.[0] ?? 'C'}
            </span>
            <span className="hidden max-w-[120px] truncate text-sm font-semibold text-gbandjo-ink sm:block">
              {user ? `${user.first_name} ${user.last_name}` : 'Commerçant'}
            </span>
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gbandjo-border bg-white py-1 shadow-lg">
              <Link
                to="/mon-commerce/parametres"
                className="block px-4 py-2.5 text-sm text-gbandjo-ink hover:bg-gbandjo-surface"
                onClick={() => setMenuOpen(false)}
              >
                Mon profil
              </Link>
              <Link
                to="/mon-commerce/notifications"
                className="block px-4 py-2.5 text-sm text-gbandjo-ink hover:bg-gbandjo-surface"
                onClick={() => setMenuOpen(false)}
              >
                Notifications {unread > 0 ? `(${unread})` : ''}
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Déconnexion
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}