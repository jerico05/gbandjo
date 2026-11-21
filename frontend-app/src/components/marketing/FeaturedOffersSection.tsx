import type { ConsumerOffer } from '../../lib/api/types'
import { OfferCard } from '../marketplace/OfferCard'
import { Button } from '../ui/Button'
import { OfferGridSkeleton } from '../ui/CatalogSkeleton'
import { Container } from '../ui/Container'

type FeaturedOffersSectionProps = {
  offers: ConsumerOffer[]
  isLiveData: boolean
  isLoading?: boolean
}

export function FeaturedOffersSection({ offers, isLiveData, isLoading }: FeaturedOffersSectionProps) {
  const top = offers.slice(0, 8)

  return (
    <section className="bg-white py-14 sm:py-16">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gbandjo-orange">Sélection</p>
            <h2 className="mt-1 text-2xl font-extrabold text-gbandjo-ink sm:text-3xl">Tendances près de vous</h2>
            <p className="mt-2 max-w-xl text-sm text-gbandjo-muted">
              {isLiveData
                ? 'Offres en temps réel auprès de nos commerces partenaires.'
                : 'Aperçu du catalogue. Connectez la plateforme pour afficher les offres en direct.'}
            </p>
          </div>
          <Button href="/espace" variant="outline" className="!rounded-full">
            Voir tout le catalogue
          </Button>
        </div>
        {isLoading && top.length === 0 ? (
          <OfferGridSkeleton count={4} />
        ) : top.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gbandjo-border bg-gbandjo-surface py-16 text-center text-gbandjo-muted">
            Les premières offres apparaîtront ici dès qu&apos;un commerce sera actif.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {top.map((offer) => (
              <OfferCard key={offer.id} offer={offer} offerBasePath="/espace/offres" variant="marketplace" />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}