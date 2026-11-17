import { cn } from '../../lib/utils/cn'

type PaginationProps = {
  page: number
  pages: number
  hasPrev: boolean
  hasNext: boolean
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, pages, hasPrev, hasNext, onPageChange, className }: PaginationProps) {
  if (pages <= 1) return null

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)} aria-label="Pagination">
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-gbandjo-border px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Précédent
      </button>
      <span className="text-sm text-gbandjo-muted">
        Page {page} / {pages}
      </span>
      <button
        type="button"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-gbandjo-border px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Suivant
      </button>
    </nav>
  )
}