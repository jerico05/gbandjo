import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { LogoGbandjo } from '../branding/LogoGbandjo'
import { Icon } from '../icons/Icon'

const discover = [
  { to: '/espace', label: 'Marketplace' },
  { href: '/#comment-ca-marche', label: 'Comment ça marche' },
  { href: '/#commercants', label: 'Pour les commerçants' },
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
      <div className="bg-[#ebe4d8] px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gbandjo-green-dark">Newsletter</p>
            <h2 className="mt-1 text-xl font-extrabold text-gbandjo-ink">Restez informé du mouvement anti gaspi</h2>
          </div>
          {sent ? (
            <p className="text-sm font-semibold text-gbandjo-green">Merci pour votre inscription !</p>
          ) : (
            <form onSubmit={onNewsletter} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="min-w-0 flex-1 rounded-xl border border-gbandjo-border bg-white px-4 py-3 text-sm outline-none focus:border-gbandjo-green"
              />
              <button type="submit" className="rounded-xl bg-gbandjo-ink px-6 py-3 text-sm font-bold text-white hover:bg-gbandjo-green-dark">
                S&apos;inscrire
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="bg-gbandjo-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="brightness-0 invert">
              <LogoGbandjo />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              Gbandjo connecte consommateurs et commerces locaux pour sauver les invendus encore bons. Une place de
              marché anti gaspillage à portée de main.
            </p>
            <div className="flex gap-2">
              {(['message', 'sparkle', 'store'] as const).map((name) => (
                <span key={name} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-gbandjo-green-light">
                  <Icon name={name} className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-bold text-gbandjo-green-light">Découvrir</p>
            <ul className="space-y-2 text-sm text-white/70">
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
            <p className="mb-3 text-sm font-bold text-gbandjo-green-light">Commerçants</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/inscription" className="hover:text-white">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link to="/connexion" className="hover:text-white">
                  Connexion boutique
                </Link>
              </li>
              <li>
                <Link to="/mon-commerce" className="hover:text-white">
                  Espace boutique
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-bold text-gbandjo-green-light">Confiance</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="inline-flex items-center gap-2">
                <Icon name="store" className="h-4 w-4 text-gbandjo-orange" />
                Règlement au retrait chez le commerçant
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon name="truck" className="h-4 w-4 text-gbandjo-orange" />
                Retrait en commerce
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon name="refresh" className="h-4 w-4 text-gbandjo-orange" />
                Impact anti gaspi mesurable
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-white/50 sm:flex-row sm:px-6">
            <p>© {new Date().getFullYear()} Gbandjo. Ensemble contre le gaspillage.</p>
            <LegalLinks items={legal} />
          </div>
        </div>
      </div>
    </footer>
  )
}

function LegalLinks({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {items.map((item) => (
        <a key={item.label} href={item.href} className="hover:text-white/80">
          {item.label}
        </a>
      ))}
    </div>
  )
}