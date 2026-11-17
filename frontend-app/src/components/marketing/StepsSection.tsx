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
    <section id="comment-ca-marche" className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gbandjo-green">Simple &amp; efficace</p>
          <h2 className="mt-2 text-2xl font-extrabold text-gbandjo-ink sm:text-3xl">Comment utiliser Gbandjo</h2>
          <p className="mt-3 text-gbandjo-muted">Quatre étapes pour réserver, récupérer et agir contre le gaspillage.</p>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-gbandjo-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="absolute right-4 top-4 text-4xl font-black text-gbandjo-surface">{String(index + 1).padStart(2, '0')}</span>
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gbandjo-green text-white">
                <Icon name={step.icon} className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-gbandjo-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gbandjo-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}