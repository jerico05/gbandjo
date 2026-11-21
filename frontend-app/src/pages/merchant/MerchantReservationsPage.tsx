import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { MerchantWorkspace } from '../../components/merchant/MerchantWorkspace'
import { MerchantTableSkeleton } from '../../components/ui/MerchantDataSkeleton'
import { ReservationStatusBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { getApiErrorMessage } from '../../lib/api/errors'
import { formatFcfa } from '../../lib/utils/formatMoney'
import { merchantKeys, useMerchantReservations } from '../../lib/hooks/useMerchant'
import {
  confirmMerchantReservation,
  markReservationPickedUp,
  rejectMerchantReservation,
  cancelMerchantReservation,
} from '../../lib/services/reservationService'

export function MerchantReservationsPage() {
  const queryClient = useQueryClient()
  const reservationsQuery = useMerchantReservations()
  const reservations = reservationsQuery.data ?? []
  const isLoading = reservationsQuery.isLoading && !reservationsQuery.data
  const [error, setError] = useState('')

  async function runAction(action: () => Promise<unknown>) {
    try {
      await action()
      await queryClient.invalidateQueries({ queryKey: merchantKeys.reservations })
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <MerchantWorkspace title="Réservations reçues">
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {isLoading ? (
        <MerchantTableSkeleton rows={4} />
      ) : (
      <ul className="space-y-4">
        {reservations.map((r) => (
          <li key={r.id} className="rounded-2xl border border-gbandjo-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold text-gbandjo-green">{r.reference}</p>
                <p className="font-bold">{r.offer_label ?? `Offre #${r.offer_id}`}</p>
                <p className="text-sm text-gbandjo-muted">
                  Qté {r.quantity}, {formatFcfa(r.unit_price)}
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
      )}
    </MerchantWorkspace>
  )
}