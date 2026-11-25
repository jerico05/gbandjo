import { Link } from 'react-router-dom'

import { Icon } from '../icons/Icon'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

const trust = [
  { icon: 'store' as const, label: 'Retrait chez le commerçant' },
  { icon: 'reservations' as const, label: 'Réservation gratuite' },
  { icon: 'truck' as const, label: 'Récupération rapide' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[360px] sm:min-h-[440px] lg:min-h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(105deg, rgba(26,46,31,0.94) 0%, rgba(26,46,31,0.62) 48%, rgba(46,125,50,0.38) 100%), url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80)',
          }}
        />
        <Container className="relative flex min-h-[360px] flex-col justify-center py-12 sm:min-h-[440px] sm:py-16 lg:min-h-[480px] lg:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-gbandjo-orange/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white sm:text-[11px]">
              Marketplace anti gaspi
            </p>
            <h1 className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-tight text-white sm:mt-4 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              Tout ce qui est encore bon,
              <span className="text-gbandjo-green-light"> à sauver près de chez vous</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/88 sm:mt-4 sm:text-base lg:text-lg">
              Réservez les invendus en ligne, payez et récupérez directement chez le commerçant partenaire.
            </p>
            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
              <Button href="/espace" className="!w-full !rounded-full !px-8 !shadow-lg !shadow-gbandjo-green/30 sm:!w-auto">
                Découvrir les offres
              </Button>
              <Link
                to="/inscription"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/50 bg-white/10 px-8 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
              >
                Je suis commerçant
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className="relative z-10 -mt-5 pb-6 sm:-mt-7 sm:pb-8">
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gbandjo-border bg-white p-3 shadow-lg sm:grid-cols-3 sm:gap-4 sm:px-5 sm:py-5">
          {trust.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-3 rounded-xl bg-gbandjo-surface/70 px-3 py-3 sm:bg-transparent sm:px-0 sm:py-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gbandjo-green-light text-gbandjo-green">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold text-gbandjo-muted sm:text-sm">{item.label}</span>
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}
