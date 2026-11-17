type AdminPlaceholderPageProps = {
  title: string
  description?: string
}

export function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
  return (
    <div className="p-4 sm:p-8">
      <div className="rounded-2xl border border-gbandjo-border bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gbandjo-ink">{title}</h2>
        <p className="mt-2 text-sm text-gbandjo-muted">
          {description ?? 'Contenu disponible dans une prochaine version.'}
        </p>
      </div>
    </div>
  )
}