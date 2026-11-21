import { Link } from 'react-router-dom'

import { Icon } from '../icons/Icon'
import { cn } from '../../lib/utils/cn'

type AdminKpiCardProps = {
  label: string
  value: string | number
  hint?: string
  icon: 'users' | 'store' | 'tag' | 'layout'
  to?: string
  loading?: boolean
}

export function AdminKpiCard({ label, value, hint, icon, to, loading }: AdminKpiCardProps) {
  const inner = (
    <article
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-gbandjo-border bg-white p-5 shadow-sm transition',
        to && 'hover:border-gbandjo-blue/40 hover:shadow-md',
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gbandjo-blue/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gbandjo-muted">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-gbandjo-blue">{loading ? '…' : value}</p>
          {hint ? <p className="mt-1 text-xs text-gbandjo-muted">{hint}</p> : null}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gbandjo-blue-light text-gbandjo-blue">
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
    </article>
  )

  if (to) {
    return (
      <Link to={to} className="block">
        {inner}
      </Link>
    )
  }

  return inner
}