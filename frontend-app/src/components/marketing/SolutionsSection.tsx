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
    <section id="commercants" className="pb-12 pt-2 sm:pb-16 sm:pt-4 lg:pb-20">
      <Container>
        <SolutionsGrid>
          <article className="relative overflow-hidden rounded-2xl border border-gbandjo-border bg-gradient-to-br from-gbandjo-green to-gbandjo-green-dark p-6 text-white shadow-xl sm:rounded-3xl sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <Icon name="bag" className="mb-3 h-9 w-9 text-gbandjo-green-light sm:mb-4 sm:h-10 sm:w-10" />
            <h2 className="text-xl font-extrabold sm:text-2xl lg:text-3xl">Pour les consommateurs</h2>
            <p className="mt-2 max-w-md text-sm text-white/90 sm:mt-3 sm:text-base">
              Paniers surprises, colis anti gaspi et offres de dernière minute. Une expérience fluide sur mobile et
              desktop.
            </p>
            <Button
              href="/espace"
              variant="secondary"
              className="mt-6 !w-full !rounded-full !bg-white !text-gbandjo-green hover:!bg-gbandjo-green-light sm:mt-8 sm:!w-auto"
            >
              Explorer le catalogue
            </Button>
          </article>

          <article className="rounded-2xl border border-gbandjo-border bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8 lg:p-10">
            <Icon name="store" className="mb-3 h-9 w-9 text-gbandjo-orange sm:mb-4 sm:h-10 sm:w-10" />
            <h2 className="text-xl font-extrabold text-gbandjo-ink sm:text-2xl lg:text-3xl">Pour les commerçants</h2>
            <p className="mt-2 text-sm text-gbandjo-muted sm:mt-3 sm:text-base">
              Publiez vos invendus, gérez stocks et réservations depuis un tableau de bord moderne.
            </p>
            <ul className="mt-4 space-y-2 sm:mt-5">
              {merchantPoints.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-gbandjo-muted">
                  <span className="mt-0.5 text-gbandjo-green">✓</span>
                  {line}
                </li>
              ))}
            </ul>
            <Button href="/inscription" className="mt-6 !w-full !rounded-full sm:mt-8 sm:!w-auto">
              Créer ma boutique
            </Button>
          </article>
        </SolutionsGrid>
      </Container>
    </section>
  )
}

function SolutionsGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">{children}</div>
}
