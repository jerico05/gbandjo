import { Icon, categoryIconAt } from '../icons/Icon'
import { cn } from '../../lib/utils/cn'

type CategoryPillStripProps = {
  categories: Array<{ id: number; name: string }>
  selectedId: string
  onSelect: (id: string) => void
}

export function CategoryPillStrip({ categories, selectedId, onSelect }: CategoryPillStripProps) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onSelect('')}
        className={cn(
          'flex shrink-0 flex-col items-center gap-2 rounded-2xl px-3 py-2 transition',
          !selectedId ? 'bg-gbandjo-green-light text-gbandjo-green-dark' : 'text-gbandjo-muted hover:bg-gbandjo-surface',
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gbandjo-border bg-gbandjo-surface shadow-sm">
          <Icon name="category" className="h-6 w-6" />
        </span>
        <span className="text-xs font-semibold">Toutes</span>
      </button>
      {categories.map((c, index) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(String(c.id))}
          className={cn(
            'flex shrink-0 flex-col items-center gap-2 rounded-2xl px-3 py-2 transition',
            selectedId === String(c.id)
              ? 'bg-gbandjo-green-light text-gbandjo-green-dark'
              : 'text-gbandjo-muted hover:bg-gbandjo-surface',
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gbandjo-border bg-gbandjo-surface shadow-sm">
            <Icon name={categoryIconAt(index)} className="h-6 w-6 text-gbandjo-green" />
          </span>
          <span className="max-w-[72px] truncate text-xs font-semibold">{c.name}</span>
        </button>
      ))}
    </div>
  )
}