import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { LogoGbandjo } from '../branding/LogoGbandjo'
import { Icon } from '../icons/Icon'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils/cn'
import { logout } from '../../lib/services/authService'
import { fetchUnreadCount } from '../../lib/services/notificationService'
import { useAuthStore } from '../../stores/authStore'
import { PublicUtilityBar } from './PublicUtilityBar'

const mainNav = [
  { to: '/espace', label: 'Catalogue' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  { href: '/#commercants', label: 'Commerçants' },
]

export function PublicHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const clearSession = useAuthStore((s) => s.clearSession)
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) {
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

  async function handleLogout() {
    if (refreshToken) {
      try {
        await logout(refreshToken)
      } catch {
        /* ignore */
      }
    }
    clearSession()
    navigate('/')
  }

  const marketplaceTo = user?.role === 'COMMERCANT' ? '/mon-commerce' : '/espace'

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_20px_rgba(26,46,31,0.07)]">
      <div className="h-1 w-full bg-gradient-to-r from-gbandjo-green via-gbandjo-green to-gbandjo-orange" aria-hidden />
      <PublicUtilityBar />

      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="shrink-0 rounded-lg p-0.5 transition hover:opacity-90" aria-label="Accueil Gbandjo">
            <LogoGbandjo variant="header" />
          </Link>

          <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {mainNav.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-3 py-2 text-sm font-semibold transition',
                      isActive ? 'bg-gbandjo-green-light text-gbandjo-green-dark' : 'text-gbandjo-muted hover:bg-gbandjo-surface hover:text-gbandjo-ink',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-gbandjo-muted transition hover:bg-gbandjo-surface hover:text-gbandjo-ink"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              to={marketplaceTo}
              className="hidden items-center gap-2 rounded-full border border-gbandjo-border bg-gbandjo-surface px-3 py-2 text-sm font-semibold text-gbandjo-ink transition hover:border-gbandjo-green sm:inline-flex"
            >
              <Icon name="search" className="h-4 w-4 text-gbandjo-green" />
              Explorer
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'CONSOMMATEUR' ? '/espace/notifications' : '/notifications'}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gbandjo-border text-gbandjo-muted transition hover:border-gbandjo-green hover:text-gbandjo-green"
                  aria-label="Notifications"
                >
                  <Icon name="bell" className="h-5 w-5" />
                  {unread > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gbandjo-orange px-1 text-[9px] font-bold text-white">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  ) : null}
                </Link>
                <div ref={menuRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-2xl border border-gbandjo-border bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-gbandjo-green/40"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gbandjo-green text-sm font-bold text-white">
                      {user.first_name?.[0] ?? 'U'}
                    </span>
                    <span className="max-w-[88px] truncate text-sm font-semibold text-gbandjo-ink">{user.first_name}</span>
                  </button>
                  {menuOpen ? (
                    <HeaderUserMenu user={user} onLogout={() => void handleLogout()} onClose={() => setMenuOpen(false)} />
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-gbandjo-green transition hover:bg-gbandjo-green-light sm:inline"
                >
                  Connexion
                </Link>
                <Button href="/inscription" variant="secondary" className="!hidden !px-4 !py-2 sm:!inline-flex">
                  S&apos;inscrire
                </Button>
                <Button href="/inscription" className="!px-4 !py-2 sm:hidden">
                  Rejoindre
                </Button>
              </>
            )}

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gbandjo-border lg:hidden"
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-expanded={mobileNavOpen}
              aria-label="Menu"
            >
              <Icon name="grid" className="h-5 w-5 text-gbandjo-ink" />
            </button>
          </div>
        </div>

        {mobileNavOpen ? (
          <nav className="mt-3 space-y-1 border-t border-gbandjo-border pt-3 lg:hidden">
            {mainNav.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
            {user ? (
              <button
                type="button"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                onClick={() => void handleLogout()}
              >
                Déconnexion
              </button>
            ) : (
              <Link to="/connexion" className="block rounded-lg px-3 py-2 text-sm font-semibold text-gbandjo-green" onClick={() => setMobileNavOpen(false)}>
                Connexion
              </Link>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  )
}

function HeaderUserMenu({
  user,
  onLogout,
  onClose,
}: {
  user: NonNullable<ReturnType<typeof useAuthStore.getState>['user']>
  onLogout: () => void
  onClose: () => void
}) {
  const hub =
    user.role === 'CONSOMMATEUR' ? '/espace' : user.role === 'COMMERCANT' ? '/mon-commerce' : '/espace'

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-xl">
      <div className="border-b border-gbandjo-border bg-gbandjo-surface/50 px-4 py-3">
        <p className="text-sm font-bold text-gbandjo-ink">
          {user.first_name} {user.last_name}
        </p>
        <p className="truncate text-xs text-gbandjo-muted">{user.email}</p>
      </div>
      <Link to={hub} className="block px-4 py-2.5 text-sm hover:bg-gbandjo-surface" onClick={onClose}>
        Mon espace
      </Link>
      <Link to="/profil" className="block px-4 py-2.5 text-sm hover:bg-gbandjo-surface" onClick={onClose}>
        Mon profil
      </Link>
      <button type="button" onClick={onLogout} className="w-full border-t px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
        Déconnexion
      </button>
    </div>
  )
}