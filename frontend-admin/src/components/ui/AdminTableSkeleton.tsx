export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gbandjo-border bg-white p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b border-gbandjo-border py-4 last:border-0">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gbandjo-surface" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-gbandjo-surface" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gbandjo-surface" />
          </div>
        </div>
      ))}
    </div>
  )
}