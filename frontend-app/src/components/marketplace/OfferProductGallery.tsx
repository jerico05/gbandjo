import { useMemo, useState } from 'react'

import { Icon } from '../icons/Icon'
import { cn } from '../../lib/utils/cn'

type ProductImage = {
  id: number
  url: string
  sort_order?: number
}

type OfferProductGalleryProps = {
  productName: string
  images: ProductImage[]
  fallbackUrl?: string | null
}

export function OfferProductGallery({ productName, images, fallbackUrl }: OfferProductGalleryProps) {
  const sorted = useMemo(
    () => [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [images],
  )
  const urls = sorted.length > 0 ? sorted.map((img) => img.url) : fallbackUrl ? [fallbackUrl] : []
  const [activeIndex, setActiveIndex] = useState(0)
  const activeUrl = urls[activeIndex]

  if (urls.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-gbandjo-border bg-gbandjo-surface">
        <Icon name="image" className="h-16 w-16 text-gbandjo-green/40" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-gbandjo-border bg-white shadow-sm">
        <img src={activeUrl} alt={productName} className="aspect-[4/3] w-full object-cover" />
      </div>
      {urls.length > 1 ? (
        <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Toutes les images du produit">
          {urls.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition',
                index === activeIndex
                  ? 'border-gbandjo-green shadow-md'
                  : 'border-gbandjo-border opacity-80 hover:opacity-100',
              )}
              aria-label={`Image ${index + 1} sur ${urls.length}`}
              aria-current={index === activeIndex}
            >
              <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  )
}