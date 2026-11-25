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
    <section className="py-8 sm:py-12 lg:py-14">
      <Container>
        <div className="mb-5 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-gbandjo-ink sm:text-2xl lg:text-3xl">Acheter par catégorie</h2>
            <p className="mt-1 text-sm text-gbandjo-muted sm:mt-2">Boulangerie, épicerie, frais et plus encore</p>
          </div>
          <Link to="/espace" className="text-sm font-semibold text-gbandjo-green hover:underline">
            Tout le catalogue →
          </Link>
        </div>
        <ul className="grid grid-cols-3 gap-3 sm:flex sm:gap-5 sm:overflow-x-auto sm:pb-2 sm:[-ms-overflow-style:none] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {items.map((cat, index) => (
            <li key={cat.id} className="sm:shrink-0">
              <Link to="/espace" className="group flex flex-col items-center gap-2 sm:w-[100px] sm:gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gbandjo-border bg-white shadow-sm transition group-hover:border-gbandjo-green group-hover:shadow-md sm:h-[72px] sm:w-[72px]">
                  <Icon
                    name={categoryIconAt(index)}
                    className="h-6 w-6 text-gbandjo-green transition group-hover:scale-110 sm:h-7 sm:w-7"
                  />
                </span>
                <span className="line-clamp-2 text-center text-[11px] font-bold text-gbandjo-ink sm:text-xs">{cat.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
