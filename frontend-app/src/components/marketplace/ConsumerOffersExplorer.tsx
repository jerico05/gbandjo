import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { useConsumerSearch } from '../layout/consumer/consumer-search-context'

import { CategoryPillStrip } from './CategoryPillStrip'
import { Icon } from '../icons/Icon'
import { MarketplacePromoTiles } from './MarketplacePromoTiles'
import { OfferCard } from './OfferCard'
import { Button } from '../ui/Button'
import { useDebouncedValue } from '../../lib/hooks/useDebouncedValue'
import { useGeolocation } from '../../lib/hooks/useGeolocation'
import type { Category, ConsumerOffer } from '../../lib/api/types'
import { fetchCategories, fetchOffers } from '../../lib/services/catalogService'

type ConsumerOffersExplorerProps = {
  offerBasePath?: string
  showCategoryStrip?: boolean
  layout?: 'default' | 'marketplace'
}

export function ConsumerOffersExplorer({
  offerBasePath = '/espace/offres',
  showCategoryStrip = true,
  layout = 'default',
}: ConsumerOffersExplorerProps) {
  const [offers, setOffers] = useState<ConsumerOffer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const { query: headerQuery, setQuery: setHeaderQuery } = useConsumerSearch()
  const [query, setQuery] = useState(headerQuery)
  const debouncedQuery = useDebouncedValue(query)
  const isMarketplace = layout === 'marketplace'
  const cardVariant = isMarketplace ? 'marketplace' : 'default'

  useEffect(() => {
    setQuery(headerQuery)
  }, [headerQuery])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [minDiscount, setMinDiscount] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortByDistance, setSortByDistance] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { coords, error: geoError, isLoading: geoLoading, requestPosition, clear } = useGeolocation({
    requestOnMount: true,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void fetchCategories().then(setCategories)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      const list = await fetchOffers({
        q: debouncedQuery || undefined,
        category_id: categoryFilter ? Number(categoryFilter) : undefined,
        min_discount: minDiscount || undefined,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        sort: sortByDistance && coords ? 'distance' : undefined,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      })
      if (!cancelled) {
        setOffers(list.offers)
        setIsLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, categoryFilter, minDiscount, minPrice, maxPrice, sortByDistance, coords])

  function toggleDistanceSort() {
    if (sortByDistance) {
      setSortByDistance(false)
      clear()
      return
    }
    requestPosition()
    setSortByDistance(true)
  }

  const spotlight =
    offers.length > 0
      ? offers.reduce((best, o) =>
          Number(o.discount_percentage) > Number(best.discount_percentage) ? o : best,
        )
      : null

  const sortedByDiscount = [...offers].sort((a, b) => Number(b.discount_percentage) - Number(a.discount_percentage))
  const trending = isMarketplace ? sortedByDiscount.slice(0, 4) : offers
  const recommended = isMarketplace ? sortedByDiscount.slice(4) : []

  function renderGrid(list: ConsumerOffer[]) {
    if (isLoading) {
      return <p className="py-8 text-center text-gbandjo-muted">Chargement…</p>
    }
    if (list.length === 0) {
      return <p className="py-8 text-center text-gbandjo-muted">Aucune offre pour le moment.</p>
    }
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((offer) => (
          <OfferCard key={offer.id} offer={offer} offerBasePath={offerBasePath} variant={cardVariant} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-stretch overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-sm lg:hidden">
        <span className="flex items-center pl-4 text-gbandjo-muted">
          <Icon name="search" className="h-5 w-5" />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setHeaderQuery(e.target.value)
          }}
          placeholder="Rechercher produit, commerce…"
          className="min-w-0 flex-1 px-3 py-3.5 text-sm outline-none"
        />
        <button type="button" className="bg-gbandjo-green px-6 text-sm font-semibold text-white hover:bg-gbandjo-green-dark">
          OK
        </button>
      </div>

      {showCategoryStrip && categories.length > 0 ? (
        <div>
          {isMarketplace ? (
            <h2 className="mb-4 text-lg font-extrabold text-gbandjo-ink">Acheter par catégorie</h2>
          ) : null}
          <CategoryPillStrip categories={categories} selectedId={categoryFilter} onSelect={setCategoryFilter} />
        </div>
      ) : null}

      {isMarketplace && !isLoading && offers.length > 0 ? (
        <MarketplacePromoTiles offers={offers} offerBasePath={offerBasePath} />
      ) : null}

      {!isMarketplace && spotlight ? (
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-gbandjo-green to-gbandjo-green-dark p-6 text-white shadow-lg sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">Offre flash</p>
          <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">
            −{spotlight.discount_percentage}% sur {spotlight.product?.name ?? 'cette offre anti gaspi'}
          </h2>
          <p className="mt-2 text-sm text-white/90">
            {spotlight.discounted_price} € au lieu de {spotlight.initial_price} € chez {spotlight.store?.name}
          </p>
          <Link
            to={`${offerBasePath}/${spotlight.id}`}
            className="mt-4 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gbandjo-green"
          >
            Voir l&apos;offre
          </Link>
        </section>
      ) : null}

      <OfferFiltersPanel
        isMarketplace={isMarketplace}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        minDiscount={minDiscount}
        setMinDiscount={setMinDiscount}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortByDistance={sortByDistance}
        toggleDistanceSort={toggleDistanceSort}
        geoLoading={geoLoading}
        geoError={geoError}
      />

      {isMarketplace ? (
        <>
          <section>
            <div className="mb-4 flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-extrabold text-gbandjo-ink">Tendances</h2>
              <Link to="/espace#catalogue" className="text-sm font-semibold text-gbandjo-green hover:underline">
                Tout voir
              </Link>
            </div>
            {renderGrid(trending)}
          </section>
          {recommended.length > 0 ? (
            <section>
              <div className="mb-4 flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-extrabold text-gbandjo-ink">Recommandé pour vous</h2>
              </div>
              {renderGrid(recommended)}
            </section>
          ) : null}
        </>
      ) : (
        <section>
          <h2 className="mb-4 text-lg font-bold text-gbandjo-ink">Sélection du moment</h2>
          {renderGrid(offers)}
        </section>
      )}
    </div>
  )
}

function OfferFiltersPanel(props: {
  isMarketplace: boolean
  filtersOpen: boolean
  setFiltersOpen: (v: boolean) => void
  minDiscount: string
  setMinDiscount: (v: string) => void
  minPrice: string
  setMinPrice: (v: string) => void
  maxPrice: string
  setMaxPrice: (v: string) => void
  sortByDistance: boolean
  toggleDistanceSort: () => void
  geoLoading: boolean
  geoError: string | null
}) {
  const grid = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="number"
        min={0}
        placeholder="Réduction min. %"
        value={props.minDiscount}
        onChange={(e) => props.setMinDiscount(e.target.value)}
        className="rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm"
      />
      <input
        type="number"
        min={0}
        step="0.01"
        placeholder="Prix min"
        value={props.minPrice}
        onChange={(e) => props.setMinPrice(e.target.value)}
        className="rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm"
      />
      <input
        type="number"
        min={0}
        step="0.01"
        placeholder="Prix max"
        value={props.maxPrice}
        onChange={(e) => props.setMaxPrice(e.target.value)}
        className="rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm"
      />
      <Button
        type="button"
        variant={props.sortByDistance ? 'primary' : 'outline'}
        onClick={props.toggleDistanceSort}
        disabled={props.geoLoading}
        className="!py-2.5"
      >
        {props.geoLoading ? '…' : props.sortByDistance ? 'Tri distance' : 'Par distance'}
      </Button>
    </div>
  )

  if (props.isMarketplace) {
    return (
      <section className="rounded-2xl border border-gbandjo-border bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => props.setFiltersOpen(!props.filtersOpen)}
          className="flex w-full items-center justify-between gap-2 text-sm font-bold text-gbandjo-ink"
        >
          <span className="inline-flex items-center gap-2">
            <Icon name="filter" className="h-4 w-4 text-gbandjo-green" />
            Filtres avancés
          </span>
          <span className="text-gbandjo-muted">{props.filtersOpen ? '−' : '+'}</span>
        </button>
        {props.filtersOpen ? <div className="mt-4 space-y-2">{grid}</div> : null}
        {props.geoError ? <p className="mt-2 text-xs text-red-600">{props.geoError}</p> : null}
      </section>
    )
  }

  return (
    <>
      {grid}
      {props.geoError ? <p className="text-xs text-red-600">{props.geoError}</p> : null}
    </>
  )
}