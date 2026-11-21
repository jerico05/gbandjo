import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { LogoGbandjo } from '../../branding/LogoGbandjo'
import { Button } from '../../ui/Button'
import { Icon } from '../../icons/Icon'
import { logout } from '../../../lib/services/authService'
import { fetchUnreadCount } from '../../../lib/services/notificationService'
import { useAuthStore } from '../../../stores/authStore'
import { useConsumerSearch } from './consumer-search-context'

export function ConsumerTopBar() {
  const navigate = useNavigate()
  const { query, setQuery } = useConsumerSearch()
  const user = useAuthStore((s) => s.user)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const clearSession = useAuthStore((s) => s.clearSession)
  const [localSearch, setLocalSearch] = useState(query)
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalSearch(query)
  }, [query])

  useEffect(() => {
    if (!user || user.role !== 'CONSOMMATEUR') {
      setUnread(0)
      return
    }
    void fetchUnreadCount()
      .then(setUnread)
      .catch(() => setUnread(0))
  }, [user])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function submitSearch(e: FormEvent) {
    e.preventDefault()
    setQuery(localSearch.trim())
    navigate('/espace#catalogue')
  }

  async function handleLogout() {
    if (refreshToken) {
      try {
        await logout(refreshToken)
      } catch {
        /* ignore */
      }
    }
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gbandjo-border/70 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/espace" className="shrink-0" aria-label="Marketplace Gbandjo">
            <LogoGbandjo variant="header" />
          </Link>

          <form
            onSubmit={submitSearch}
            className="hidden min-w-0 flex-1 items-stretch overflow-hidden rounded-full border border-gbandjo-border bg-gbandjo-surface sm:flex lg:mx-2"
          >
            <input
              type="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Rechercher produit, commerce, catégorie…"
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-gbandjo-muted"
              aria-label="Rechercher"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-gbandjo-ink px-4 text-white transition hover:bg-gbandjo-green-dark sm:px-5"
              aria-label="Lancer la recherche"
            >
              <Icon name="search" className="h-5 w-5 md:hidden" />
              <span className="hidden text-sm font-semibold md:inline">Rechercher</span>
            </button>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            {user?.role === 'COMMERCANT' ? (
              <Link
                to="/mon-commerce"
                className="rounded-xl border border-gbandjo-border px-2.5 py-2 text-xs font-semibold text-gbandjo-ink hover:border-gbandjo-green sm:px-3 sm:text-sm"
              >
                Boutique
              </Link>
            ) : null}

            {user?.role === 'CONSOMMATEUR' ? (
              <>
                <HeaderNotificationButton unread={unread} />
                <div ref={menuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gbandjo-green text-sm font-bold text-white shadow-sm"
                    aria-expanded={menuOpen}
                    aria-label="Menu compte"
                  >
                    {user.first_name?.[0] ?? 'C'}
                  </button>
                  {menuOpen ? (
                    <AccountDropdown user={user} onLogout={() => void handleLogout()} onClose={() => setMenuOpen(false)} />
                  ) : null}
                </div>
              </>
            ) : !user ? (
              <>
                <Link
                  to="/connexion"
                  state={{ from: '/espace' }}
                  className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-gbandjo-green hover:bg-gbandjo-green-light sm:inline"
                >
                  Connexion
                </Link>
                <Button href="/inscription" className="!px-3 !py-2 text-sm sm:!px-4">
                  <span className="sm:hidden">Rejoindre</span>
                  <span className="hidden sm:inline">S&apos;inscrire</span>
                </Button>
                <div ref={menuRef} className="relative sm:hidden">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gbandjo-border bg-gbandjo-surface"
                    aria-expanded={menuOpen}
                    aria-label="Menu"
                  >
                    <Icon name="user" className="h-5 w-5 text-gbandjo-ink" />
                  </button>
                  {menuOpen ? <GuestDropdown onClose={() => setMenuOpen(false)} /> : null}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <form
          onSubmit={submitSearch}
          className="mt-3 flex items-stretch overflow-hidden rounded-full border border-gbandjo-border bg-gbandjo-surface sm:hidden"
        >
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher…"
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-gbandjo-muted"
            aria-label="Rechercher"
          />
          <button
            type="submit"
            className="bg-gbandjo-ink px-4 text-white"
            aria-label="Lancer la recherche"
          >
            <Icon name="search" className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  )
}

function HeaderNotificationButton({ unread }: { unread: number }) {
  return (
    <Link
      to="/espace/notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gbandjo-border bg-white text-gbandjo-muted transition hover:border-gbandjo-green hover:text-gbandjo-green"
      aria-label={unread > 0 ? `Notifications, ${unread} non lue${unread > 1 ? 's' : ''}` : 'Notifications'}
    >
      <Icon name="bell" className="h-5 w-5" />
      {unread > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unread > 9 ? '9+' : unread}
        </span>
      ) : null}
    </Link>
  )
}

function GuestDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-xl">
      <Link to="/connexion" state={{ from: '/espace' }} className="block px-4 py-2.5 text-sm font-semibold text-gbandjo-green" onClick={onClose}>
        Connexion
      </Link>
      <Link to="/inscription" className="block border-t px-4 py-2.5 text-sm" onClick={onClose}>
        Créer un compte
      </Link>
      <Link to="/" className="block border-t px-4 py-2.5 text-sm text-gbandjo-muted" onClick={onClose}>
        Site vitrine
      </Link>
    </div>
  )
}

function AccountDropdown({
  user,
  onLogout,
  onClose,
}: {
  user: ReturnType<typeof useAuthStore.getState>['user']
  onLogout: () => void
  onClose: () => void
}) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-xl">
      <div className="border-b border-gbandjo-border bg-gbandjo-surface/50 px-4 py-3">
        <p className="text-sm font-bold text-gbandjo-ink">
          {user?.first_name} {user?.last_name}
        </p>
        <p className="truncate text-xs text-gbandjo-muted">{user?.email}</p>
      </div>
      <Link to="/espace/profil" className="block px-4 py-2.5 text-sm" onClick={onClose}>
        Mon profil
      </Link>
      <Link to="/espace/reservations" className="block px-4 py-2.5 text-sm" onClick={onClose}>
        Mes réservations
      </Link>
      <Link to="/espace/notifications" className="block px-4 py-2.5 text-sm sm:hidden" onClick={onClose}>
        Notifications
      </Link>
      <Link to="/" className="block border-t px-4 py-2.5 text-sm text-gbandjo-muted" onClick={onClose}>
        Site vitrine
      </Link>
      <button type="button" onClick={onLogout} className="w-full border-t px-4 py-2.5 text-left text-sm text-red-600">
        Déconnexion
      </button>
    </div>
  )
}