import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { ReservationStatusBadge } from '../components/ui/StatusBadge'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { getApiErrorMessage } from '../lib/api/errors'
import type { Reservation } from '../lib/api/types'
import { formatFcfa } from '../lib/utils/formatMoney'
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
      <h1 className="text-2xl font-extrabold text-gbandjo-ink sm:text-3xl">Mes réservations</h1>
      <p className="mt-2 max-w-2xl text-sm text-gbandjo-muted">
        Après confirmation, ouvrez le détail pour la localisation et le reçu de retrait.
      </p>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {isLoading ? (
        <p className="mt-8 text-gbandjo-muted">Chargement…</p>
      ) : reservations.length === 0 ? (
        <p className="mt-8 text-gbandjo-muted">Aucune réservation pour le moment.</p>
      ) : (
        <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
          {reservations.map((r) => (
            <li key={r.id} className="rounded-2xl border border-gbandjo-border bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-semibold text-gbandjo-green">{r.reference}</p>
                  <p className="font-bold text-gbandjo-ink">{r.offer_label ?? `Offre #${r.offer_id}`}</p>
                  <p className="text-sm text-gbandjo-muted">
                    Qté {r.quantity}, {formatFcfa(r.unit_price)} / unité
                  </p>
                  <p className="text-xs text-gbandjo-muted">
                    Créée le {new Date(r.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                <ReservationStatusBadge status={r.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to={`/espace/reservations/${r.id}`}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-gbandjo-border px-4 py-2.5 text-sm font-semibold text-gbandjo-ink hover:border-gbandjo-green sm:flex-none"
                >
                  Détails
                </Link>
                {r.status === 'EN_ATTENTE' ? (
                  <Button variant="outline" type="button" className="flex-1 sm:flex-none" onClick={() => void handleCancel(r.id)}>
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