import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { LogoGbandjo } from '../branding/LogoGbandjo'
import { Icon } from '../icons/Icon'

const discover = [
  { to: '/espace', label: 'Marketplace' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  { href: '/#commercants', label: 'Commerçants' },
]

const merchantLinks = [
  { to: '/inscription', label: 'Créer un compte' },
  { to: '/connexion', label: 'Connexion' },
  { to: '/mon-commerce', label: 'Espace boutique' },
]

const legal = [
  { href: '#', label: 'Confidentialité' },
  { href: '#', label: 'Conditions' },
  { href: '#', label: 'Cookies' },
]

export function PublicFooter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function onNewsletter(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
    setEmail('')
  }

  return (
    <footer className="mt-auto border-t border-gbandjo-border">
      <div className="bg-[#ebe4d8] px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gbandjo-green-dark sm:text-xs">Newsletter</p>
            <h2 className="mt-0.5 text-sm font-extrabold text-gbandjo-ink sm:text-lg">Restez informé anti gaspi</h2>
          </div>
          {sent ? (
            <p className="text-sm font-semibold text-gbandjo-green">Merci pour votre inscription !</p>
          ) : (
            <form onSubmit={onNewsletter} className="flex w-full min-w-0 flex-row gap-2 sm:max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="min-w-0 flex-1 rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm outline-none focus:border-gbandjo-green sm:px-4 sm:py-3"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gbandjo-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-gbandjo-green-dark sm:px-6 sm:py-3"
              >
                OK
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="bg-gbandjo-ink text-white">
        <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-10">
          <div className="flex flex-row items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="brightness-0 invert">
                <LogoGbandjo variant="header" />
              </div>
              <p className="line-clamp-2 max-w-sm text-[11px] leading-relaxed text-white/70 sm:line-clamp-none sm:text-sm">
                Consommateurs et commerces locaux pour sauver les invendus encore bons.
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5 sm:gap-2">
              {(['message', 'sparkle', 'store'] as const).map((name) => (
                <span
                  key={name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-gbandjo-green-light sm:h-9 sm:w-9"
                >
                  <Icon name={name} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-3">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gbandjo-green-light sm:mb-3 sm:text-sm sm:normal-case sm:tracking-normal">
                Découvrir
              </p>
              <ul className="flex flex-col gap-1.5 text-[11px] text-white/70 sm:gap-2 sm:text-sm">
                {discover.map((link) =>
                  link.to ? (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a href={link.href} className="hover:text-white">
                        {link.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gbandjo-green-light sm:mb-3 sm:text-sm sm:normal-case sm:tracking-normal">
                Commerçants
              </p>
              <ul className="flex flex-col gap-1.5 text-[11px] text-white/70 sm:gap-2 sm:text-sm">
                {merchantLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gbandjo-green-light sm:mb-3 sm:text-sm sm:normal-case sm:tracking-normal">
                Confiance
              </p>
              <ul className="flex flex-row flex-wrap gap-x-4 gap-y-2 text-[11px] text-white/70 sm:flex-col sm:gap-2 sm:text-sm">
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="store" className="h-3.5 w-3.5 shrink-0 text-gbandjo-orange sm:h-4 sm:w-4" />
                  Paiement au retrait
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="truck" className="h-3.5 w-3.5 shrink-0 text-gbandjo-orange sm:h-4 sm:w-4" />
                  Retrait en commerce
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="refresh" className="h-3.5 w-3.5 shrink-0 text-gbandjo-orange sm:h-4 sm:w-4" />
                  Impact anti gaspi
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-3 sm:py-4">
          <div className="mx-auto flex max-w-7xl flex-row flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 text-[10px] text-white/50 sm:px-6 sm:text-xs">
            <p className="shrink-0">© {new Date().getFullYear()} Gbandjo</p>
            <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
              {legal.map((item) => (
                <a key={item.label} href={item.href} className="hover:text-white/80">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
