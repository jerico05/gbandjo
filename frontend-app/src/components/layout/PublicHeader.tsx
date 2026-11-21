import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { LogoGbandjo } from '../branding/LogoGbandjo'
import { Icon } from '../icons/Icon'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils/cn'
import { PublicUtilityBar } from './PublicUtilityBar'

const mainNav = [
  { to: '/espace', label: 'Catalogue' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  { href: '/#commercants', label: 'Commerçants' },
]

export function PublicHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
              to="/espace"
              className="hidden items-center gap-2 rounded-full border border-gbandjo-border bg-gbandjo-surface px-3 py-2 text-sm font-semibold text-gbandjo-ink transition hover:border-gbandjo-green sm:inline-flex"
            >
              <Icon name="search" className="h-4 w-4 text-gbandjo-green" />
              Explorer
            </Link>

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
            <Link
              to="/connexion"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-gbandjo-green"
              onClick={() => setMobileNavOpen(false)}
            >
              Connexion
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  )
}