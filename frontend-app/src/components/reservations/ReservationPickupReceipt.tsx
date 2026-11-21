import { Button } from '../ui/Button'
import { formatFcfa } from '../../lib/utils/formatMoney'
import { downloadReservationReceiptImage } from '../../lib/utils/reservationReceiptImage'
import type { ReservationDetail } from '../../lib/api/types'

type ReservationPickupReceiptProps = {
  reservation: ReservationDetail
}

export function ReservationPickupReceipt({ reservation }: ReservationPickupReceiptProps) {
  const store = reservation.store
  if (!store) return null

  const storeSnapshot = store
  const total = Number(reservation.unit_price) * reservation.quantity

  function handleDownload() {
    downloadReservationReceiptImage({
      reference: reservation.reference,
      offerLabel: reservation.offer_label ?? `Offre #${reservation.offer_id}`,
      storeName: storeSnapshot.name,
      storeAddress: storeSnapshot.address,
      quantity: reservation.quantity,
      unitPrice: reservation.unit_price,
      status: reservation.status,
      confirmedAt: reservation.processed_at ?? reservation.created_at,
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-dashed border-gbandjo-green/40 bg-gradient-to-b from-gbandjo-green-light/30 to-white p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-gbandjo-green">Retrait sécurisé</p>
      <p className="mt-2 font-mono text-lg font-bold text-gbandjo-ink">{reservation.reference}</p>
      <p className="mt-1 text-sm text-gbandjo-muted">{reservation.offer_label}</p>
      <p className="mt-3 text-sm text-gbandjo-ink">
        {store.name} — {store.address}
      </p>
      <p className="mt-2 text-sm font-semibold text-gbandjo-ink">
        {reservation.quantity} × {formatFcfa(reservation.unit_price)} = {formatFcfa(total)}
      </p>
      <Button type="button" className="mt-5 w-full sm:w-auto" onClick={handleDownload}>
        Télécharger le reçu (image)
      </Button>
      <p className="mt-3 text-xs text-gbandjo-muted">
        Montrez cette image ou la référence au commerçant pour valider le retrait. Le paiement se fait sur place.
      </p>
    </div>
  )
}