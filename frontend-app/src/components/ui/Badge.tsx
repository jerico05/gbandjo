import type { ReactNode } from 'react'

import { cn } from '../../lib/utils/cn'

type BadgeProps = {
  children: ReactNode
  tone?: 'green' | 'orange' | 'neutral'
  className?: string
}

export function Badge({ children, tone = 'green', className }: BadgeProps) {
  const tones = {
    green: 'bg-gbandjo-green-light text-gbandjo-green-dark',
    orange: 'bg-orange-100 text-orange-800',
    neutral: 'bg-gbandjo-surface text-gbandjo-muted border border-gbandjo-border',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}