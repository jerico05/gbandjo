import { useEffect, useState } from 'react'

import { MerchantWorkspace } from '../../components/merchant/MerchantWorkspace'
import { ReservationStatusBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { getApiErrorMessage } from '../../lib/api/errors'
import type { Reservation } from '../../lib/api/types'
import {
  confirmMerchantReservation,
  listMerchantReservations,
  markReservationPickedUp,
  rejectMerchantReservation,
  cancelMerchantReservation,
} from '../../lib/services/reservationService'

export function MerchantReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [error, setError] = useState('')

  async function load() {
    try {
      setReservations(await listMerchantReservations())
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function runAction(action: () => Promise<unknown>) {
    try {
      await action()
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <MerchantWorkspace title="Réservations reçues">
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-4">
        {reservations.map((r) => (
          <li key={r.id} className="rounded-2xl border border-gbandjo-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold">{r.offer_label ?? `Offre #${r.offer_id}`}</p>
                <p className="text-sm text-gbandjo-muted">
                  Qté {r.quantity}, {r.unit_price} €
                </p>
              </div>
              <ReservationStatusBadge status={r.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {r.status === 'EN_ATTENTE' ? (
                <>
                  <Button type="button" onClick={() => void runAction(() => confirmMerchantReservation(r.id))}>
                    Confirmer
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => void runAction(() => rejectMerchantReservation(r.id, 'Refus commerçant'))}
                  >
                    Rejeter
                  </Button>
                </>
              ) : null}
              {r.status === 'CONFIRMEE' ? (
                <>
                  <Button type="button" onClick={() => void runAction(() => markReservationPickedUp(r.id))}>
                    Marquer retirée
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => void runAction(() => cancelMerchantReservation(r.id, 'Annulation commerçant'))}
                  >
                    Annuler
                  </Button>
                </>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </MerchantWorkspace>
  )
}