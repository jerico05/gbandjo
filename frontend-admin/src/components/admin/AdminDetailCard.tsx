import type { ReactNode } from 'react'

type AdminDetailCardProps = {
  title: string
  children: ReactNode
  className?: string
}

export function AdminDetailCard({ title, children, className }: AdminDetailCardProps) {
  return (
    <section className={`rounded-3xl border border-gbandjo-border bg-white p-5 shadow-sm sm:p-6 ${className ?? ''}`}>
      <h2 className="mb-4 text-base font-bold text-gbandjo-ink">{title}</h2>
      {children}
    </section>
  )
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-gbandjo-border py-3 last:border-0 sm:flex-row sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gbandjo-muted sm:w-40 sm:shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-gbandjo-ink">{value}</dd>
    </div>
  )
}