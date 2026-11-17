import { Link } from 'react-router-dom'

export function PublicUtilityBar() {
  return (
    <div className="border-b border-gbandjo-border bg-gbandjo-surface px-4 py-2 text-[11px] text-gbandjo-muted sm:text-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-between">
        <p className="font-medium text-gbandjo-ink/85">
          Sans paiement en ligne. Réservation puis retrait chez le commerçant.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 font-semibold sm:gap-5">
          <Link to="/espace" className="hover:text-gbandjo-green">
            Offres du moment
          </Link>
          <a href="/#comment-ca-marche" className="hover:text-gbandjo-green">
            Comment ça marche
          </a>
          <Link to="/inscription" className="hover:text-gbandjo-green">
            Devenir partenaire
          </Link>
        </div>
      </div>
    </div>
  )
}