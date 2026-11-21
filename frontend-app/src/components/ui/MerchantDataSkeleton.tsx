export function MerchantTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 rounded-2xl border border-gbandjo-border bg-white p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-gbandjo-surface" />
          <div className="flex flex-1 flex-col gap-2 py-1">
            <div className="h-4 w-1/3 animate-pulse rounded bg-gbandjo-surface" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-gbandjo-surface" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MerchantCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-2xl border border-gbandjo-border bg-gbandjo-surface" />
      ))}
    </div>
  )
}