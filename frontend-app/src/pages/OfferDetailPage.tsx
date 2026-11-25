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
  const infoTiles = [
    {
      icon: 'package' as const,
      label: 'Disponible',
      value: `${offer.available_quantity} unité${offer.available_quantity > 1 ? 's' : ''}`,
    },
    {
      icon: 'offers' as const,
      label: 'Début',
      value: formatOfferDateTime(offer.starts_at),
    },
    {
      icon: 'reservations' as const,
      label: 'Fin',
      value: formatOfferDateTime(offer.ends_at),
    },
    ...(offer.expiry_date
      ? [
          {
            icon: 'shield' as const,
            label: 'À consommer avant',
            value: formatOfferDate(offer.expiry_date),
          },
        ]
      : []),
    ...(offer.distance_km != null
      ? [
          {
            icon: 'location' as const,
            label: 'Distance',
            value: `${offer.distance_km} km`,
          },
        ]
      : []),
  ]

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-sm">
        <div className="border-b border-gbandjo-border bg-gradient-to-r from-gbandjo-green-light/70 to-white px-4 py-3 sm:px-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gbandjo-green-dark">Informations</h2>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gbandjo-muted">Description</p>
            <p className="text-sm leading-relaxed text-gbandjo-ink">
              {description || 'Aucune description fournie pour ce produit.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {infoTiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-xl border border-gbandjo-border/80 bg-[#f8f9fb] px-3 py-3"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gbandjo-green-light text-gbandjo-green">
                  <Icon name={tile.icon} className="h-4 w-4" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gbandjo-muted">{tile.label}</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-gbandjo-ink">{tile.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {offer.store ? (
        <div className="rounded-2xl border border-gbandjo-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gbandjo-orange/15 text-gbandjo-orange">
              <Icon name="store" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gbandjo-muted">Commerce</p>
              <p className="mt-0.5 text-base font-bold text-gbandjo-ink">{offer.store.name}</p>
              <div className="mt-3 space-y-2 text-sm text-gbandjo-ink">
                <p className="flex items-start gap-2">
                  <Icon name="location" className="mt-0.5 h-4 w-4 shrink-0 text-gbandjo-green" />
                  <span>{offer.store.address ?? 'Adresse non renseignée'}</span>
                </p>
                {offer.store.phone ? (
                  <a
                    href={`tel:${offer.store.phone}`}
                    className="inline-flex items-center gap-2 font-medium text-gbandjo-green hover:underline"
                  >
                    <Icon name="message" className="h-4 w-4 shrink-0" />
                    {offer.store.phone}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}