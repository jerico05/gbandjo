import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { LogoGbandjo } from '../branding/LogoGbandjo'
import { Icon } from '../icons/Icon'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils/cn'
import { logoutCurrentSession } from '../../lib/services/sessionLogout'
import { useAuthStore } from '../../stores/authStore'

const mainNav = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/espace', label: 'Catalogue' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  { href: '/#commercants', label: 'Commerçants' },
]

export function PublicHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const hub =
    user?.role === 'COMMERCANT' ? '/mon-commerce' : user?.role === 'CONSOMMATEUR' ? '/espace' : '/espace'

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function handleLogout() {
    setMenuOpen(false)
    await logoutCurrentSession()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gbandjo-border/70 bg-white/95 shadow-[0_2px_16px_rgba(26,46,31,0.06)] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="shrink-0 rounded-lg p-0.5 transition hover:opacity-90" aria-label="Accueil Gbandjo">
            <LogoGbandjo variant="header" />
          </Link>

          <nav className="ml-1 hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {mainNav.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-3 py-2 text-sm font-semibold transition',
                      isActive
                        ? 'bg-gbandjo-green-light text-gbandjo-green-dark'
                        : 'text-gbandjo-muted hover:bg-gbandjo-surface hover:text-gbandjo-ink',
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

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Link
              to={hub}
              className="hidden items-center gap-2 rounded-full border border-gbandjo-border bg-gbandjo-surface px-3 py-2 text-sm font-semibold text-gbandjo-ink transition hover:border-gbandjo-green sm:inline-flex"
            >
              <Icon name="search" className="h-4 w-4 text-gbandjo-green" />
              {user?.role === 'COMMERCANT' ? 'Mon commerce' : 'Explorer'}
            </Link>

            {user ? (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-2xl border border-gbandjo-border py-1 pl-1 pr-2 sm:pr-3"
                  aria-expanded={menuOpen}
                  aria-label="Menu compte"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gbandjo-green text-sm font-bold text-white">
                    {user.first_name?.[0] ?? 'U'}
                  </span>
                  <span className="hidden max-w-[7rem] truncate text-sm font-semibold text-gbandjo-ink sm:inline">
                    {user.first_name}
                  </span>
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-xl">
                    <div className="border-b border-gbandjo-border bg-gbandjo-surface/50 px-4 py-3">
                      <p className="text-sm font-bold text-gbandjo-ink">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="truncate text-xs text-gbandjo-muted">{user.email}</p>
                    </div>
                    <Link to={hub} className="block px-4 py-2.5 text-sm hover:bg-gbandjo-surface" onClick={() => setMenuOpen(false)}>
                      {user.role === 'COMMERCANT' ? 'Mon commerce' : 'Mon espace'}
                    </Link>
                    {user.role === 'CONSOMMATEUR' ? (
                      <Link
                        to="/espace/reservations"
                        className="block px-4 py-2.5 text-sm hover:bg-gbandjo-surface"
                        onClick={() => setMenuOpen(false)}
                      >
                        Mes réservations
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void handleLogout()}
                      className="w-full border-t px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : null}
              </div>
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
                <Button href="/inscription" className="!px-3 !py-2 text-sm sm:hidden">
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
          <nav className="mt-3 space-y-1 border-t border-gbandjo-border pt-3 lg:hidden" aria-label="Menu mobile">
            {mainNav.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
            <div className="my-2 border-t border-gbandjo-border" />
            {user ? (
              <>
                <Link
                  to={hub}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gbandjo-green"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {user.role === 'COMMERCANT' ? 'Mon commerce' : 'Mon espace'}
                </Link>
                <button
                  type="button"
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600"
                  onClick={() => {
                    setMobileNavOpen(false)
                    void handleLogout()
                  }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gbandjo-green"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gbandjo-ink hover:bg-gbandjo-surface"
                  onClick={() => setMobileNavOpen(false)}
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  )
}
