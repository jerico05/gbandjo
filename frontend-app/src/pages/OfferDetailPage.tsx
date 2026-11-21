import { type FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { OfferProductGallery } from '../components/marketplace/OfferProductGallery'
import { Icon } from '../components/icons/Icon'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { OfferGridSkeleton } from '../components/ui/CatalogSkeleton'
import { getApiErrorMessage } from '../lib/api/errors'
import type { ConsumerOffer, Reservation } from '../lib/api/types'
import { fetchOfferById } from '../lib/services/catalogService'
import { createReservation, listConsumerReservations } from '../lib/services/reservationService'
import { formatOfferDate, formatOfferDateTime } from '../lib/utils/formatDate'
import { formatFcfa } from '../lib/utils/formatMoney'
import { useAuthStore } from '../stores/authStore'

const ACTIVE_RESERVATION_STATUSES = new Set(['EN_ATTENTE', 'CONFIRMEE'])

export function OfferDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const inConsumerShell = location.pathname.startsWith('/espace')
  const catalogHref = '/espace'
  const user = useAuthStore((s) => s.user)
  const [offer, setOffer] = useState<ConsumerOffer | null>(null)
  const [existingReservation, setExistingReservation] = useState<Reservation | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const offerId = Number(id)
    if (!offerId) return
    void fetchOfferById(offerId)
      .then((data) => setOffer(data))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    if (!user || user.role !== 'CONSOMMATEUR' || !offer) {
      setExistingReservation(null)
      return
    }
    void listConsumerReservations()
      .then((items) => {
        const found =
          items.find((r) => r.offer_id === offer.id && ACTIVE_RESERVATION_STATUSES.has(r.status)) ?? null
        setExistingReservation(found)
      })
      .catch(() => setExistingReservation(null))
  }, [user, offer])

  async function handleReserve(e: FormEvent) {
    e.preventDefault()
    if (!offer) return
    if (!user) {
      navigate('/connexion', { state: { from: `/espace/offres/${offer.id}` } })
      return
    }
    if (user.role !== 'CONSOMMATEUR') {
      setError('Seuls les comptes consommateur peuvent réserver.')
      return
    }
    setError('')
    try {
      const reservation = await createReservation(offer.id, quantity)
      navigate(`/espace/reservations/${reservation.id}`, {
        state: { created: true },
      })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Réservation impossible.'))
    }
  }

  if (isLoading) {
    return (
      <Container className={inConsumerShell ? 'py-4' : 'py-10'}>
        <OfferGridSkeleton count={1} />
      </Container>
    )
  }

  if (!offer) {
    return (
      <Container className="py-16 text-center">
        <p className="text-gbandjo-muted">Offre introuvable.</p>
        <Button href={catalogHref} className="mt-4" variant="outline">
          Retour au catalogue
        </Button>
      </Container>
    )
  }

  const productName = offer.product?.name ?? `Offre #${offer.id}`
  const images = offer.product?.images ?? []
  const description = offer.product?.description?.trim()

  return (
    <Container className={inConsumerShell ? 'py-0 pb-8' : 'py-10'}>
      <Link to={catalogHref} className="text-sm font-medium text-gbandjo-green hover:underline">
        ← Retour aux offres
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
        <OfferProductGallery
          productName={productName}
          images={images}
          fallbackUrl={offer.product?.image_url}
        />

        <div className="space-y-6">
          <header>
            {offer.product?.category_name ? (
              <Badge tone="green" className="mb-2">
                {offer.product.category_name}
              </Badge>
            ) : null}
            <h1 className="text-3xl font-extrabold text-gbandjo-ink">{productName}</h1>
            <p className="mt-2 text-lg font-semibold text-gbandjo-ink">{offer.store?.name}</p>
          </header>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gbandjo-green">{formatFcfa(offer.discounted_price)}</span>
            <span className="text-lg text-gbandjo-muted line-through">{formatFcfa(offer.initial_price)}</span>
            <span className="rounded-full bg-gbandjo-orange/15 px-2.5 py-0.5 text-sm font-bold text-gbandjo-orange">
              −{offer.discount_percentage} %
            </span>
          </div>

          <OfferInfoSection offer={offer} description={description} />

          <p className="rounded-xl border border-gbandjo-green/20 bg-gbandjo-green-light/50 px-4 py-3 text-sm text-gbandjo-ink">
            <span className="font-semibold text-gbandjo-green-dark">Pas de paiement en ligne.</span> Après confirmation de
            la réservation, rendez-vous chez{' '}
            <span className="font-medium">{offer.store?.name ?? 'le commerçant'}</span> pour régler et récupérer votre
            réservation.
          </p>

          {existingReservation ? (
            <div className="space-y-3 rounded-2xl border border-gbandjo-border bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-gbandjo-ink">Réservation déjà en cours</h2>
              <p className="text-sm text-gbandjo-muted">
                Vous avez déjà une réservation sur cette offre ({existingReservation.reference}). Une seule
                réservation active est autorisée par offre.
              </p>
              <Button href={`/espace/reservations/${existingReservation.id}`} className="w-full">
                {existingReservation.status === 'EN_ATTENTE' ? 'Voir / modifier ma réservation' : 'Voir ma réservation'}
              </Button>
            </div>
          ) : (
            <form className="space-y-4 rounded-2xl border border-gbandjo-border bg-white p-6 shadow-sm" onSubmit={handleReserve}>
              <h2 className="text-base font-bold text-gbandjo-ink">Réserver cette offre</h2>
              <Input
                label="Quantité"
                type="number"
                name="quantity"
                min={1}
                max={offer.available_quantity}
                value={String(quantity)}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" className="w-full">
                Réserver
              </Button>
            </form>
          )}
        </div>
      </div>
    </Container>
  )
}

function OfferInfoSection({ offer, description }: { offer: ConsumerOffer; description?: string }) {
  return (
    <section className="rounded-2xl border border-gbandjo-border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gbandjo-muted">Informations</h2>
      <dl className="space-y-3 text-sm">
        <InfoRow label="Description" value={description || 'Aucune description fournie pour ce produit.'} />
        <InfoRow label="Disponible" value={`${offer.available_quantity} unité(s) en stock`} />
        <InfoRow label="Valable du" value={formatOfferDateTime(offer.starts_at)} />
        <InfoRow label="Jusqu’au" value={formatOfferDateTime(offer.ends_at)} />
        {offer.expiry_date ? <InfoRow label="Date limite consommation" value={formatOfferDate(offer.expiry_date)} /> : null}
        {offer.distance_km != null ? (
          <InfoRow label="Distance" value={`${offer.distance_km} km (approximatif)`} />
        ) : null}
      </dl>

      {offer.store ? (
        <>
          <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-gbandjo-muted">Commerce</h3>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Adresse" value={offer.store.address ?? '—'} icon="location" />
            {offer.store.phone ? <InfoRow label="Téléphone" value={offer.store.phone} /> : null}
          </dl>
        </>
      ) : null}
    </section>
  )
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: 'location'
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-gbandjo-muted sm:w-36">{label}</dt>
      <dd className="flex items-start gap-2 font-medium text-gbandjo-ink">
        {icon === 'location' ? <Icon name="location" className="mt-0.5 h-4 w-4 shrink-0 text-gbandjo-green" /> : null}
        <span>{value}</span>
      </dd>
    </div>
  )
}