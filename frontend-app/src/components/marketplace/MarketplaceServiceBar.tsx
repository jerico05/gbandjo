import { Icon } from '../icons/Icon'

const items = [
  { icon: 'truck' as const, title: 'Retrait local', text: 'Commerces de proximité' },
  { icon: 'refresh' as const, title: 'Retours simples', text: 'Selon conditions du commerce' },
  { icon: 'store' as const, title: 'Paiement en boutique', text: 'Aucun paiement en ligne sur Gbandjo' },
  { icon: 'message' as const, title: 'Support', text: 'Aide via votre espace' },
]

export function MarketplaceServiceBar() {
  return (
    <section className="rounded-2xl border border-gbandjo-border bg-white px-4 py-6 shadow-sm sm:px-8">
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gbandjo-green-light text-gbandjo-green">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-gbandjo-ink">{item.title}</p>
              <p className="text-xs text-gbandjo-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}