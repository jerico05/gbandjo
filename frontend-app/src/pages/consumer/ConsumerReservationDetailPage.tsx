import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ReservationPickupReceipt } from '../../components/reservations/ReservationPickupReceipt'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Icon } from '../../components/icons/Icon'
import { Input } from '../../components/ui/Input'
import { ReservationStatusBadge } from '../../components/ui/StatusBadge'
import { getApiErrorMessage } from '../../lib/api/errors'
import type { ReservationDetail } from '../../lib/api/types'
import { formatFcfa } from '../../lib/utils/formatMoney'
import {
  cancelConsumerReservation,
  getConsumerReservation,
  updateConsumerReservation,
} from '../../lib/services/reservationService'

const PICKUP_STATUSES = new Set(['CONFIRMEE', 'RETIREE'])

export function ConsumerReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState<ReservationDetail | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const reservationId = Number(id)

  async function load() {
    if (!Number.isFinite(reservationId)) {
      setError('Réservation introuvable.')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const data = await getConsumerReservation(reservationId)
      setReservation(data)
      setQuantity(data.quantity)
      setError('')
    } catch (err) {
      setError(getApiErrorMessage(err))
      setReservation(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [reservationId])

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    if (!reservation) return
    setIsSaving(true)
    setError('')
    setSuccess('')
    try {
      const updated = await updateConsumerReservation(reservation.id, quantity)
      setReservation(updated)
      setQuantity(updated.quantity)
      setSuccess('Quantité mise à jour.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCancel() {
    if (!reservation) return
    try {
      await cancelConsumerReservation(reservation.id)
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  if (isLoading) {
    return (
      <Container className="py-6">
        <p className="text-gbandjo-muted">Chargement…</p>
      </Container>
    )
  }

  if (!reservation) {
    return (
      <Container className="py-6">
        <p className="text-red-600">{error || 'Réservation introuvable.'}</p>
        <Button href="/espace/reservations" variant="outline" className="mt-4">
          Retour
        </Button>
      </Container>
    )
  }

  const store = reservation.store
  const mapsUrl =
    store && Number.isFinite(store.latitude) && Number.isFinite(store.longitude)
      ? `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`
      : null
  const showPickup = PICKUP_STATUSES.has(reservation.status)

  return (
    <Container className="space-y-6 py-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-gbandjo-green hover:underline"
        >
          ← Retour
        </button>
        <Link to="/espace/reservations" className="text-sm text-gbandjo-muted hover:text-gbandjo-green">
          Toutes mes réservations
        </Link>
      </div>

      <header className="rounded-2xl border border-gbandjo-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gbandjo-muted">Référence</p>
            <p className="mt-1 font-mono text-xl font-extrabold text-gbandjo-ink">{reservation.reference}</p>
            <h1 className="mt-3 text-lg font-bold text-gbandjo-ink">{reservation.offer_label ?? `Offre #${reservation.offer_id}`}</h1>
            <p className="mt-2 text-sm text-gbandjo-muted">
              {reservation.quantity} × {formatFcfa(reservation.unit_price)}
            </p>
            <p className="mt-1 text-xs text-gbandjo-muted">
              Créée le {new Date(reservation.created_at).toLocaleString('fr-FR')}
            </p>
            {reservation.expires_at && reservation.status === 'EN_ATTENTE' ? (
              <p className="mt-1 text-xs text-gbandjo-orange">
                À confirmer avant le {new Date(reservation.expires_at).toLocaleString('fr-FR')}
              </p>
            ) : null}
            {reservation.reason ? <p className="mt-2 text-sm text-red-600">{reservation.reason}</p> : null}
          </div>
          <ReservationStatusBadge status={reservation.status} />
        </div>
      </header>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-gbandjo-green">{success}</p> : null}

      {reservation.status === 'EN_ATTENTE' ? (
        <section className="space-y-4 rounded-2xl border border-gbandjo-border bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-gbandjo-ink">Modifier la réservation</h2>
          <p className="text-sm text-gbandjo-muted">
            Vous pouvez changer la quantité tant que le commerçant n&apos;a pas confirmé. Une fois confirmée, la
            modification n&apos;est plus possible.
          </p>
          <form className="flex flex-wrap items-end gap-3" onSubmit={handleUpdate}>
            <div className="min-w-[8rem] flex-1">
              <Input
                label="Quantité"
                type="number"
                name="quantity"
                min={1}
                value={String(quantity)}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <Button type="submit" disabled={isSaving || quantity === reservation.quantity}>
              {isSaving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </form>
          <Button variant="outline" type="button" onClick={() => void handleCancel()}>
            Annuler la réservation
          </Button>
        </section>
      ) : null}

      {store ? (
        <section className="rounded-2xl border border-gbandjo-border bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-bold text-gbandjo-ink">
            <Icon name="location" className="h-5 w-5 text-gbandjo-green" />
            Point de retrait
          </h2>
          <p className="mt-2 font-semibold text-gbandjo-ink">{store.name}</p>
          {showPickup ? (
            <>
              <p className="text-sm text-gbandjo-muted">{store.address}</p>
              {store.phone ? <p className="mt-1 text-sm text-gbandjo-muted">Tél. {store.phone}</p> : null}
              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gbandjo-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-gbandjo-green-dark"
                >
                  Ouvrir dans Google Maps
                </a>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-gbandjo-muted">
              L&apos;adresse et la localisation seront affichées dès confirmation par le commerçant.
            </p>
          )}
        </section>
      ) : null}

      {showPickup ? <ReservationPickupReceipt reservation={reservation} /> : null}
    </Container>
  )
}