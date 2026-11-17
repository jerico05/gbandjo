import { Link } from 'react-router-dom'

import { Icon } from '../icons/Icon'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

const trust = [
  { icon: 'store' as const, label: 'Retrait chez le commerçant' },
  { icon: 'reservations' as const, label: 'Réservation en ligne gratuite' },
  { icon: 'truck' as const, label: 'Retrait rapide' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[320px] sm:min-h-[420px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(100deg, rgba(26,46,31,0.92) 0%, rgba(26,46,31,0.55) 50%, rgba(46,125,50,0.35) 100%), url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80)',
          }}
        />
        <Container className="relative flex min-h-[320px] flex-col justify-center py-14 sm:min-h-[420px] sm:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-gbandjo-orange/90 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              Marketplace anti gaspi
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Tout ce qui est encore bon,
              <span className="text-gbandjo-green-light"> à sauver près de chez vous</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/88 sm:text-lg">
              Gbandjo relie commerces et consommateurs pour valoriser les invendus. Réservez en ligne, payez et récupérez
              directement chez le commerçant partenaire.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/espace" className="!rounded-full !px-8 !shadow-lg !shadow-gbandjo-green/30">
                Découvrir les offres
              </Button>
              <Link
                to="/inscription"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/50 bg-white/10 px-8 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Je suis commerçant
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className="relative z-10 -mt-6 pb-8 sm:-mt-8">
        <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-gbandjo-border bg-white px-6 py-5 shadow-lg sm:justify-around sm:gap-10">
          {trust.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2 text-xs font-semibold text-gbandjo-muted sm:text-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gbandjo-green-light text-gbandjo-green">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              {item.label}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}