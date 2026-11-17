import { Link } from 'react-router-dom'

import type { Category } from '../../lib/api/types'
import { categoryIconAt, Icon } from '../icons/Icon'
import { Container } from '../ui/Container'

type CategoriesSectionProps = {
  categories: Category[]
}

const fallbacks = [
  { id: -1, name: 'Boulangerie' },
  { id: -2, name: 'Épicerie' },
  { id: -3, name: 'Restaurant' },
  { id: -4, name: 'Bio' },
  { id: -5, name: 'Maison' },
  { id: -6, name: 'Frais' },
]

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const items = categories.length ? categories.slice(0, 8) : fallbacks

  return (
    <section className="py-12 sm:py-14">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gbandjo-ink sm:text-3xl">Acheter par catégorie</h2>
            <p className="mt-2 text-sm text-gbandjo-muted">Boulangerie, épicerie, frais et plus encore</p>
          </div>
          <Link to="/espace" className="text-sm font-semibold text-gbandjo-green hover:underline">
            Tout le catalogue →
          </Link>
        </div>
        <ul className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((cat, index) => (
            <li key={cat.id} className="shrink-0">
              <Link
                to="/espace"
                className="group flex w-[88px] flex-col items-center gap-3 sm:w-[100px]"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gbandjo-border bg-white shadow-sm transition group-hover:border-gbandjo-green group-hover:shadow-md sm:h-[72px] sm:w-[72px]">
                  <Icon name={categoryIconAt(index)} className="h-7 w-7 text-gbandjo-green transition group-hover:scale-110" />
                </span>
                <span className="text-center text-xs font-bold text-gbandjo-ink">{cat.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}