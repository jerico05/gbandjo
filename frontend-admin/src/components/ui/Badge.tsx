import type { ReactNode } from 'react'

import { cn } from '../../lib/utils/cn'

type BadgeProps = {
  children: ReactNode
  tone?: 'blue' | 'green' | 'orange' | 'red' | 'neutral'
  className?: string
}

export function Badge({ children, tone = 'blue', className }: BadgeProps) {
  const tones = {
    blue: 'bg-gbandjo-blue-light text-gbandjo-blue-dark',
    green: 'bg-gbandjo-green-light text-gbandjo-green',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    neutral: 'bg-gbandjo-surface text-gbandjo-muted border border-gbandjo-border',
  }
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}
    >
      {children}
    </span>
  )
}