import { Link } from 'react-router-dom'

import { Icon, type IconName } from '../icons/Icon'
import { cn } from '../../lib/utils/cn'

type MerchantKpiCardProps = {
  label: string
  value: string | number
  hint?: string
  icon: IconName
  to?: string
  accent?: 'green' | 'orange' | 'neutral'
}

const accentStyles = {
  green: {
    icon: 'bg-gbandjo-green-light text-gbandjo-green',
    ring: 'hover:border-gbandjo-green/35',
  },
  orange: {
    icon: 'bg-orange-100 text-gbandjo-orange',
    ring: 'hover:border-gbandjo-orange/35',
  },
  neutral: {
    icon: 'bg-gbandjo-surface text-gbandjo-muted',
    ring: 'hover:border-gbandjo-border',
  },
}

export function MerchantKpiCard({ label, value, hint, icon, to, accent = 'green' }: MerchantKpiCardProps) {
  const styles = accentStyles[accent]
  const content = (
    <>
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl',
            styles.icon,
          )}
        >
          <Icon name={icon} className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        {to ? (
          <span className="hidden text-xs font-semibold text-gbandjo-green opacity-0 transition group-hover:opacity-100 sm:inline">
            Voir →
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-[10px] font-semibold uppercase leading-tight tracking-wide text-gbandjo-muted sm:mt-4 sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-xl font-extrabold tabular-nums text-gbandjo-ink sm:text-3xl">{value}</p>
      {hint ? <p className="mt-1 hidden text-xs text-gbandjo-muted sm:block">{hint}</p> : null}
    </>
  )

  const className = cn(
    'group block rounded-2xl border border-gbandjo-border bg-white p-3 shadow-sm transition sm:p-5',
    styles.ring,
    to && 'hover:shadow-md',
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <article className={className}>{content}</article>
}