import { Icon } from '../icons/Icon'
import { Container } from '../ui/Container'

const steps = [
  {
    title: 'Découvrez',
    icon: 'search' as const,
    description: 'Parcourez les offres et paniers surprises des commerces près de chez vous.',
  },
  {
    title: 'Réservez',
    icon: 'reservations' as const,
    description: 'Choisissez la quantité et confirmez la réservation, sans paiement en ligne.',
  },
  {
    title: 'Récupérez',
    icon: 'store' as const,
    description: 'Rendez-vous au magasin, payez sur place et récupérez avec votre confirmation.',
  },
  {
    title: 'Impact',
    icon: 'sparkle' as const,
    description: 'Vous sauvez de bons produits et réduisez le gaspillage au quotidien.',
  },
]

export function StepsSection() {
  return (
    <section id="comment-ca-marche" className="py-10 sm:py-14 lg:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gbandjo-green">Simple &amp; efficace</p>
          <h2 className="mt-2 text-xl font-extrabold text-gbandjo-ink sm:text-2xl lg:text-3xl">Comment utiliser Gbandjo</h2>
          <p className="mt-2 text-sm text-gbandjo-muted sm:mt-3 sm:text-base">
            Quatre étapes pour réserver, récupérer et agir contre le gaspillage.
          </p>
        </div>
        <ol className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-gbandjo-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <span className="absolute right-3 top-3 text-3xl font-black text-gbandjo-surface sm:right-4 sm:top-4 sm:text-4xl">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gbandjo-green text-white sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Icon name={step.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <h3 className="text-base font-bold text-gbandjo-ink sm:text-lg">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gbandjo-muted sm:mt-2">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
