import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { ReservationStatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { getApiErrorMessage } from '../lib/api/errors'
import type { Reservation } from '../lib/api/types'
import { cancelConsumerReservation, listConsumerReservations } from '../lib/services/reservationService'

export function ReservationsPage() {
  const inConsumerShell = useLocation().pathname.startsWith('/espace')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function load() {
    setIsLoading(true)
    try {
      setReservations(await listConsumerReservations())
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleCancel(id: number) {
    try {
      await cancelConsumerReservation(id)
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <Container className={inConsumerShell ? 'py-0' : 'py-10'}>
      <h1 className="text-3xl font-extrabold text-gbandjo-ink">Mes réservations</h1>
      <p className="mt-2 max-w-2xl text-sm text-gbandjo-muted">
        Le règlement se fait uniquement lors du retrait chez le commerçant. Gbandjo ne traite aucun paiement en ligne.
      </p>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {isLoading ? (
        <p className="mt-8 text-gbandjo-muted">Chargement…</p>
      ) : reservations.length === 0 ? (
        <p className="mt-8 text-gbandjo-muted">Aucune réservation pour le moment.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {reservations.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gbandjo-border bg-white p-5"
            >
              <div>
                <p className="font-bold text-gbandjo-ink">{r.offer_label ?? `Offre #${r.offer_id}`}</p>
                <p className="text-sm text-gbandjo-muted">
                  Qté {r.quantity}, {r.unit_price} € / unité
                </p>
                <p className="text-xs text-gbandjo-muted">
                  Créée le {new Date(r.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ReservationStatusBadge status={r.status} />
                {r.status === 'EN_ATTENTE' ? (
                  <Button variant="outline" type="button" onClick={() => void handleCancel(r.id)}>
                    Annuler
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}