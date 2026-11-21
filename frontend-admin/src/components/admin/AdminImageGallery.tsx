type GalleryImage = {
  id: number
  url: string
  sort_order?: number
}

type AdminImageGalleryProps = {
  images: GalleryImage[]
  title?: string
}

export function AdminImageGallery({ images, title = 'Images du produit' }: AdminImageGalleryProps) {
  if (!images.length) {
    return (
      <p className="rounded-2xl border border-dashed border-gbandjo-border bg-gbandjo-surface px-4 py-8 text-center text-sm text-gbandjo-muted">
        Aucune image associée à ce produit.
      </p>
    )
  }

  const sorted = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-gbandjo-ink">{title}</h3>
      <ImageGrid images={sorted} />
    </div>
  )
}

function ImageGrid({ images }: { images: GalleryImage[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img) => (
        <a
          key={img.id}
          href={img.url}
          target="_blank"
          rel="noreferrer"
          className="group overflow-hidden rounded-2xl border border-gbandjo-border bg-white shadow-sm"
        >
          <img
            src={img.url}
            alt=""
            className="aspect-square w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        </a>
      ))}
    </div>
  )
}