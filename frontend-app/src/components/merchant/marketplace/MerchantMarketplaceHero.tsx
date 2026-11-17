import type { ReactNode } from 'react'

import { Icon, type IconName } from '../../icons/Icon'
import { Button } from '../../ui/Button'
import { cn } from '../../../lib/utils/cn'

type MerchantMarketplaceHeroProps = {
  title: string
  subtitle: string
  eyebrow?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  stats?: Array<{ label: string; value: string | number }>
  compact?: boolean
  children?: ReactNode
}

export function MerchantMarketplaceHero({
  title,
  subtitle,
  eyebrow = 'Vitrine commerçant',
  primaryAction,
  secondaryAction,
  stats,
  compact,
  children,
}: MerchantMarketplaceHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl border border-gbandjo-border bg-white shadow-sm',
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8',
      )}
    >
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-gbandjo-green/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-gbandjo-green">{eyebrow}</p>
          <h1 className={cn('mt-2 font-extrabold text-gbandjo-ink', compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl')}>
            {title}
          </h1>
          <p className="mt-2 text-sm text-gbandjo-muted sm:text-base">{subtitle}</p>
          {(primaryAction || secondaryAction) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {primaryAction ? <Button href={primaryAction.href}>{primaryAction.label}</Button> : null}
              {secondaryAction ? (
                <Button variant="outline" href={secondaryAction.href}>
                  {secondaryAction.label}
                </Button>
              ) : null}
            </div>
          )}
        </div>
        {stats?.length ? (
          <div className="grid grid-cols-3 gap-3 lg:max-w-md">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-gbandjo-border bg-gbandjo-surface/80 px-4 py-3 text-center"
              >
                <p className="text-lg font-extrabold tabular-nums text-gbandjo-green">{s.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gbandjo-muted">{s.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {children ? <div className="relative mt-6 border-t border-gbandjo-border pt-5">{children}</div> : null}
    </section>
  )
}

const trustItems: Array<{ icon: IconName; label: string }> = [
  { icon: 'package', label: 'Catalogue à jour' },
  { icon: 'percent', label: 'Offres anti gaspi' },
  { icon: 'reservations', label: 'Réservations en ligne' },
]

export function MarketplaceTrustRow() {
  return (
    <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
      {trustItems.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2 text-xs font-medium text-gbandjo-muted">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gbandjo-green-light text-gbandjo-green">
            <Icon name={item.icon} className="h-4 w-4" />
          </span>
          {item.label}
        </span>
      ))}
    </div>
  )
}