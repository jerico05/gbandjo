import { Badge } from './Badge'

const reservationTone: Record<string, 'green' | 'orange' | 'neutral'> = {
  EN_ATTENTE: 'orange',
  CONFIRMEE: 'green',
  RETIREE: 'green',
  REJETEE: 'neutral',
  ANNULEE: 'neutral',
  EXPIREE: 'neutral',
}

type StatusBadgeProps = {
  status: string
}

export function ReservationStatusBadge({ status }: StatusBadgeProps) {
  return <Badge tone={reservationTone[status] ?? 'neutral'}>{status.replaceAll('_', ' ')}</Badge>
}