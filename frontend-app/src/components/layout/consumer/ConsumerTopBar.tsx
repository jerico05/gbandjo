import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { LogoGbandjo } from '../../branding/LogoGbandjo'
import { Button } from '../../ui/Button'
import { Icon } from '../../icons/Icon'
import { cn } from '../../../lib/utils/cn'
import { logout } from '../../../lib/services/authService'
import { fetchUnreadCount } from '../../../lib/services/notificationService'
import { useAuthStore } from '../../../stores/authStore'
import { ConsumerPromoBar } from './ConsumerPromoBar'
import { useConsumerSearch } from './consumer-search-context'

const secondaryNav = [
  { to: '/espace', label: 'Nouveautés', end: true },
  { to: '/espace', label: 'Top offres', badge: 'Hot' as const },
  { to: '/espace/reservations', label: 'Mes réservations' },
  { to: '/espace/notifications', label: 'Alertes' },
]

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
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_16px_rgba(26,46,31,0.06)]">
      <ConsumerPromoBar />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <Link to="/espace" className="shrink-0 self-start lg:self-center" aria-label="Marketplace Gbandjo">
            <LogoGbandjo variant="header" />
          </Link>

          <form
            onSubmit={submitSearch}
            className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-full border border-gbandjo-border bg-gbandjo-surface lg:mx-4"
          >
            <input
              type="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Rechercher produit, commerce, catégorie…"
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-gbandjo-muted sm:py-3"
              aria-label="Rechercher"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-gbandjo-ink px-4 text-white transition hover:bg-gbandjo-green-dark sm:px-6"
              aria-label="Lancer la recherche"
            >
              <Icon name="search" className="h-5 w-5 sm:hidden" />
              <span className="hidden text-sm font-semibold sm:inline">Rechercher</span>
            </button>
          </form>

          <div className="flex items-center justify-end gap-1 sm:gap-3">
            {user?.role === 'COMMERCANT' ? (
              <Link
                to="/mon-commerce"
                className="rounded-xl border border-gbandjo-border px-3 py-2 text-sm font-semibold text-gbandjo-ink hover:border-gbandjo-green"
              >
                Ma boutique
              </Link>
            ) : null}
            {user?.role === 'CONSOMMATEUR' ? (
              <>
                <AccountNavLink to="/espace/profil" label="Compte" icon="user" />
                <Link to="/espace/profil" className="hidden flex-col items-center gap-0.5 text-[10px] font-semibold text-gbandjo-muted transition hover:text-gbandjo-green sm:flex">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gbandjo-border bg-white">
                    <Icon name="heart" className="h-5 w-5" />
                  </span>
                  Favoris
                </Link>
                <Link
                  to="/espace/reservations"
                  className="relative flex flex-col items-center gap-0.5 text-[10px] font-semibold text-gbandjo-muted transition hover:text-gbandjo-green"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gbandjo-border bg-white">
                    <Icon name="reservations" className="h-5 w-5" />
                  </span>
                  Réservations
                </Link>
                <div ref={menuRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-2xl border border-gbandjo-border bg-white py-1 pl-1 pr-3 shadow-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gbandjo-green text-sm font-bold text-white">
                      {user.first_name?.[0] ?? 'C'}
                    </span>
                  </button>
                  {menuOpen ? (
                    <AccountDropdown user={user} onLogout={() => void handleLogout()} onClose={() => setMenuOpen(false)} unread={unread} />
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
                <Button href="/inscription" variant="secondary" className="!hidden !px-4 !py-2 sm:!inline-flex">
                  S&apos;inscrire
                </Button>
                <Button href="/inscription" className="!px-4 !py-2 text-sm sm:hidden">
                  Rejoindre
                </Button>
              </>
            ) : null}

            <div ref={user?.role === 'CONSOMMATEUR' ? undefined : menuRef} className="relative sm:hidden">
              {user?.role === 'CONSOMMATEUR' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gbandjo-border bg-gbandjo-green text-sm font-bold text-white sm:hidden"
                    aria-expanded={menuOpen}
                  >
                    {user.first_name?.[0] ?? 'C'}
                  </button>
                  {menuOpen ? (
                    <AccountDropdown user={user} onLogout={() => void handleLogout()} onClose={() => setMenuOpen(false)} unread={unread} />
                  ) : null}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gbandjo-border bg-gbandjo-surface"
                    aria-expanded={menuOpen}
                  >
                    <Icon name="user" className="h-5 w-5 text-gbandjo-ink" />
                  </button>
                  {menuOpen ? <GuestDropdown onClose={() => setMenuOpen(false)} /> : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav
        className="hidden border-t border-gbandjo-border bg-white lg:block"
        aria-label="Catégories et navigation marketplace"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2 sm:px-6">
          <Link
            to="/espace#catalogue"
            className="mr-2 inline-flex items-center gap-2 rounded-lg border border-gbandjo-border bg-gbandjo-surface px-3 py-2 text-sm font-semibold text-gbandjo-ink hover:border-gbandjo-green"
          >
            <Icon name="grid" className="h-4 w-4" />
            Catégories
          </Link>
          {secondaryNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive && item.end ? 'text-gbandjo-green' : 'text-gbandjo-muted hover:text-gbandjo-ink',
                )
              }
            >
              {item.label}
              {item.badge ? (
                <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">{item.badge}</span>
              ) : null}
            </NavLink>
          ))}
          <span className="ml-auto text-xs text-gbandjo-muted">
            {unread > 0 ? (
              <Link to="/espace/notifications" className="font-semibold text-gbandjo-orange">
                {unread} notification{unread > 1 ? 's' : ''}
              </Link>
            ) : (
              'Livraison / retrait selon le commerce'
            )}
          </span>
        </div>
      </nav>
    </header>
  )
}

function AccountNavLink({ to, label, icon }: { to: string; label: string; icon: 'user' }) {
  return (
    <Link to={to} className="hidden flex-col items-center gap-0.5 text-[10px] font-semibold text-gbandjo-muted transition hover:text-gbandjo-green sm:flex">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gbandjo-border bg-white">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      {label}
    </Link>
  )
}

function GuestDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-xl">
      <p className="border-b border-gbandjo-border bg-gbandjo-surface/50 px-4 py-3 text-xs text-gbandjo-muted">
        Connectez-vous pour réserver, suivre vos réservations et gérer votre profil.
      </p>
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
  unread,
  onLogout,
  onClose,
}: {
  user: ReturnType<typeof useAuthStore.getState>['user']
  unread: number
  onLogout: () => void
  onClose: () => void
}) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-xl">
      <div className="border-b border-gbandjo-border bg-gbandjo-surface/50 px-4 py-3">
        <p className="text-sm font-bold text-gbandjo-ink">
          {user?.first_name} {user?.last_name}
        </p>
        <p className="truncate text-xs text-gbandjo-muted">{user?.email}</p>
      </div>
      <Link to="/espace/profil" className="flex items-center gap-2 px-4 py-2.5 text-sm" onClick={onClose}>
        Mon profil
      </Link>
      <Link to="/espace/notifications" className="flex items-center gap-2 px-4 py-2.5 text-sm" onClick={onClose}>
        Notifications {unread > 0 ? `(${unread})` : ''}
      </Link>
      <button type="button" onClick={onLogout} className="w-full border-t px-4 py-2.5 text-left text-sm text-red-600">
        Déconnexion
      </button>
    </div>
  )
}