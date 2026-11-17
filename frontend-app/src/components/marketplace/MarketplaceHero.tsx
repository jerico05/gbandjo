import { Link } from 'react-router-dom'

import { Icon } from '../icons/Icon'

const trust = [
  { icon: 'store' as const, label: 'Règlement au retrait' },
  { icon: 'reservations' as const, label: 'Réservation confirmée' },
  { icon: 'truck' as const, label: 'Retrait rapide' },
]

type MarketplaceHeroProps = {
  firstName?: string | null
}

export function MarketplaceHero({ firstName }: MarketplaceHeroProps) {
  return (
  <section className="overflow-hidden rounded-3xl border border-gbandjo-border bg-white shadow-sm">
    <div className="relative min-h-[220px] sm:min-h-[280px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(105deg, rgba(26,46,31,0.88) 0%, rgba(26,46,31,0.45) 55%, rgba(26,46,31,0.15) 100%), url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80)',
        }}
      />
      <div className="relative flex min-h-[220px] flex-col justify-center px-6 py-10 sm:min-h-[280px] sm:px-10 lg:max-w-xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gbandjo-orange">Anti gaspi local</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
          {firstName ? `${firstName}, ` : 'Bienvenue, '}tout ce que vous aimez,
          <span className="text-gbandjo-green-light"> au même endroit</span>
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
          Parcourez les invendus, réservez sans paiement en ligne puis rendez-vous au commerce pour payer et récupérer.
        </p>
        <Link
          to="/espace#catalogue"
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-gbandjo-green px-6 py-3 text-sm font-bold text-white shadow-lg shadow-gbandjo-green/30 transition hover:bg-gbandjo-green-dark"
        >
          Explorer le catalogue
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-6 border-t border-gbandjo-border bg-gbandjo-surface/80 px-4 py-4 sm:justify-around sm:gap-8">
      {trust.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2 text-xs font-semibold text-gbandjo-muted">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gbandjo-green shadow-sm">
            <Icon name={item.icon} className="h-4 w-4" />
          </span>
          {item.label}
        </span>
      ))}
    </div>
  </section>
  )
}