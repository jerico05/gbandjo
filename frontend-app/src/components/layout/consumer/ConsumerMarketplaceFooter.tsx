import { Link } from 'react-router-dom'

import { LogoGbandjo } from '../../branding/LogoGbandjo'

export function ConsumerMarketplaceFooter() {
  return (
    <footer className="mt-10 border-t border-gbandjo-border bg-gbandjo-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <div className="brightness-0 invert">
            <LogoGbandjo />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            La marketplace anti gaspi qui relie consommateurs et commerces locaux pour sauver les invendus encore bons.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-gbandjo-green-light">Boutique</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to="/espace#catalogue" className="hover:text-white">
                Catalogue
              </Link>
            </li>
            <li>
              <Link to="/espace/reservations" className="hover:text-white">
                Mes réservations
              </Link>
            </li>
            <li>
              <Link to="/espace/notifications" className="hover:text-white">
                Notifications
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-gbandjo-green-light">Service client</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to="/espace/profil" className="hover:text-white">
                Mon compte
              </Link>
            </li>
            <li>
              <a href="/#comment-ca-marche" className="hover:text-white">
                Aide &amp; FAQ
              </a>
            </li>
            <li>
              <Link to="/" className="hover:text-white">
                Site vitrine
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-gbandjo-green-light">À propos</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to="/inscription" className="hover:text-white">
                Devenir commerçant
              </Link>
            </li>
            <li>
              <span className="text-white/50">Appli mobile bientôt disponible</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Gbandjo. Confidentialité, Conditions et Cookies
      </div>
    </footer>
  )
}