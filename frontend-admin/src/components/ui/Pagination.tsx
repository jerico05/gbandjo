type PaginationProps = {
  page: number
  pages: number
  hasPrev: boolean
  hasNext: boolean
  onPageChange: (page: number) => void
}

export function Pagination({ page, pages, hasPrev, hasNext, onPageChange }: PaginationProps) {
  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-gbandjo-border bg-white px-4 py-2 text-sm font-medium text-gbandjo-ink transition hover:bg-gbandjo-blue-light hover:text-gbandjo-blue disabled:opacity-40"
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
        className="rounded-xl border border-gbandjo-border bg-white px-4 py-2 text-sm font-medium text-gbandjo-ink transition hover:bg-gbandjo-blue-light hover:text-gbandjo-blue disabled:opacity-40"
      >
        Suivant
      </button>
    </div>
  )
}