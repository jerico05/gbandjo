import { type FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Icon } from '../components/icons/Icon'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { getApiErrorMessage } from '../lib/api/errors'
import type { ConsumerOffer } from '../lib/api/types'
import { fetchOfferById } from '../lib/services/catalogService'
import { createReservation } from '../lib/services/reservationService'
import { useAuthStore } from '../stores/authStore'

export function OfferDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const inConsumerShell = location.pathname.startsWith('/espace')
  const catalogHref = '/espace'
  const user = useAuthStore((s) => s.user)
  const [offer, setOffer] = useState<ConsumerOffer | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const offerId = Number(id)
    if (!offerId) return
    void fetchOfferById(offerId).then((data) => {
      setOffer(data)
      setIsLoading(false)
    })
  }, [id])

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
    setSuccess('')
    try {
      await createReservation(offer.id, quantity)
      setSuccess(
        'Réservation enregistrée. Une fois confirmée, présentez-vous au commerce pour payer et récupérer votre offre.',
      )
    } catch (err) {
      setError(getApiErrorMessage(err, 'Réservation impossible.'))
    }
  }

  if (isLoading) {
    return (
      <Container className={inConsumerShell ? 'py-4 text-center text-gbandjo-muted' : 'py-16 text-center text-gbandjo-muted'}>
        Chargement de l&apos;offre…
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

  return (
    <Container className={inConsumerShell ? 'py-0' : 'py-10'}>
      <Link to={catalogHref} className="text-sm font-medium text-gbandjo-green hover:underline">
        ← Retour aux offres
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="flex h-72 items-center justify-center rounded-3xl border border-gbandjo-border bg-gbandjo-surface">
          {offer.product?.image_url ? (
            <img src={offer.product.image_url} alt="" className="h-full w-full rounded-3xl object-cover" />
          ) : (
            <Icon name="image" className="h-16 w-16 text-gbandjo-green/40" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gbandjo-ink">{offer.product?.name ?? `Offre #${offer.id}`}</h1>
          <p className="mt-2 text-gbandjo-muted">{offer.store?.name}</p>
          {offer.store?.address ? <p className="text-sm text-gbandjo-muted">{offer.store.address}</p> : null}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gbandjo-green">{offer.discounted_price} €</span>
            <span className="text-lg text-gbandjo-muted line-through">{offer.initial_price} €</span>
            <span className="rounded-full bg-gbandjo-orange/15 px-2 py-0.5 text-sm font-bold text-gbandjo-orange">
              −{offer.discount_percentage}%
            </span>
          </div>
          <p className="mt-4 text-sm text-gbandjo-muted">
            Stock : {offer.available_quantity}. Fin le{' '}
            {new Date(offer.ends_at).toLocaleString('fr-FR')}
          </p>
          <p className="mt-3 rounded-xl border border-gbandjo-green/20 bg-gbandjo-green-light/50 px-4 py-3 text-sm text-gbandjo-ink">
            <span className="font-semibold text-gbandjo-green-dark">Pas de paiement en ligne.</span> Après confirmation de
            la réservation, rendez-vous chez <span className="font-medium">{offer.store?.name ?? 'le commerçant'}</span>{' '}
            pour régler et récupérer votre réservation au créneau indiqué.
          </p>
          <form className="mt-8 space-y-4 rounded-2xl border border-gbandjo-border bg-white p-6" onSubmit={handleReserve}>
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
            {success ? <p className="text-sm text-gbandjo-green">{success}</p> : null}
            <Button type="submit" className="w-full">
              Réserver
            </Button>
          </form>
        </div>
      </div>
    </Container>
  )
}