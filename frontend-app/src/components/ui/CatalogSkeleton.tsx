export function OfferGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  )
}

function OfferCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gbandjo-border bg-white">
      <div className="h-44 animate-pulse bg-gbandjo-surface" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-gbandjo-surface" />
        <div className="h-4 w-full animate-pulse rounded bg-gbandjo-surface" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gbandjo-surface" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-gbandjo-surface" />
      </div>
    </div>
  )
}