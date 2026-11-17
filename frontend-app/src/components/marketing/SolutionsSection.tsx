import type { ReactNode } from 'react'

import { Icon } from '../icons/Icon'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'

const merchantPoints = [
  'Valorisation des surplus sans complexité',
  'Créneaux de retrait configurables',
  'Notifications à chaque réservation',
]

export function SolutionsSection() {
  return (
    <section id="commercants" className="pb-16 pt-4 sm:pb-20">
      <Container>
        <SolutionsGrid>
          <article className="relative overflow-hidden rounded-3xl border border-gbandjo-border bg-gradient-to-br from-gbandjo-green to-gbandjo-green-dark p-8 text-white shadow-xl sm:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <Icon name="bag" className="mb-4 h-10 w-10 text-gbandjo-green-light" />
            <h2 className="text-2xl font-extrabold sm:text-3xl">Pour les consommateurs</h2>
            <p className="mt-3 max-w-md text-white/90">
              Paniers surprises, colis anti gaspi et offres de dernière minute. Une expérience fluide sur mobile et
              desktop.
            </p>
            <Button
              href="/espace"
              variant="secondary"
              className="mt-8 !rounded-full !bg-white !text-gbandjo-green hover:!bg-gbandjo-green-light"
            >
              Explorer le catalogue
            </Button>
          </article>

          <article className="rounded-3xl border border-gbandjo-border bg-white p-8 shadow-lg sm:p-10">
            <Icon name="store" className="mb-4 h-10 w-10 text-gbandjo-orange" />
            <h2 className="text-2xl font-extrabold text-gbandjo-ink sm:text-3xl">Pour les commerçants</h2>
            <p className="mt-3 text-gbandjo-muted">
              Publiez vos invendus, gérez stocks et réservations depuis un tableau de bord moderne : validation admin,
              offres actives et statistiques.
            </p>
            <ul className="mt-5 space-y-2">
              {merchantPoints.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-gbandjo-muted">
                  <span className="mt-0.5 text-gbandjo-green">✓</span>
                  {line}
                </li>
              ))}
            </ul>
            <Button href="/inscription" className="mt-8 !rounded-full">
              Créer ma boutique
            </Button>
          </article>
        </SolutionsGrid>
      </Container>
    </section>
  )
}

function SolutionsGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-8 lg:grid-cols-2">{children}</div>
}