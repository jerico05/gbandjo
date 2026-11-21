import { useQueryClient } from '@tanstack/react-query'
import { type FormEvent, useState } from 'react'

import { MerchantMarketplaceHero } from '../../components/merchant/marketplace/MerchantMarketplaceHero'
import { MerchantOfferMarketCard } from '../../components/merchant/marketplace/MerchantOfferMarketCard'
import { MerchantCardsSkeleton } from '../../components/ui/MerchantDataSkeleton'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { getApiErrorMessage } from '../../lib/api/errors'
import { formatFcfa } from '../../lib/utils/formatMoney'
import { merchantKeys, useMerchantOffers, useMerchantProducts } from '../../lib/hooks/useMerchant'
import {
  createMerchantOffer,
  deactivateMerchantOffer,
  withdrawMerchantOffer,
} from '../../lib/services/merchantOfferService'

function toIsoFromLocal(value: string) {
  return new Date(value).toISOString()
}

export function MerchantOffersPage() {
  const queryClient = useQueryClient()
  const offersQuery = useMerchantOffers()
  const productsQuery = useMerchantProducts()
  const offers = offersQuery.data ?? []
  const products = productsQuery.data ?? []
  const isLoading = offersQuery.isLoading && !offersQuery.data

  const [error, setError] = useState('')
  const [form, setForm] = useState({
    product_id: '',
    initial_price: '',
    discounted_price: '',
    available_quantity: '1',
    starts_at: '',
    ends_at: '',
  })

  async function refreshMerchantData() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: merchantKeys.offers }),
      queryClient.invalidateQueries({ queryKey: merchantKeys.products }),
    ])
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    try {
      await createMerchantOffer({
        product_id: Number(form.product_id),
        initial_price: form.initial_price,
        discounted_price: form.discounted_price,
        available_quantity: Number(form.available_quantity),
        starts_at: toIsoFromLocal(form.starts_at),
        ends_at: toIsoFromLocal(form.ends_at),
      })
      setForm({
        product_id: '',
        initial_price: '',
        discounted_price: '',
        available_quantity: '1',
        starts_at: '',
        ends_at: '',
      })
      await refreshMerchantData()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function handleDeactivate(id: number) {
    try {
      await deactivateMerchantOffer(id)
      await refreshMerchantData()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  const activeOffers = offers.filter((o) => o.status === 'ACTIVE')

  return (
    <div className="space-y-6">
      <MerchantMarketplaceHero
        compact
        title="Offres et promos anti gaspi"
        subtitle="Créez des promotions visibles sur le marketplace, comme une flash deal pour vos invendus."
        primaryAction={{ label: 'Gérer le catalogue', href: '/mon-commerce/produits' }}
        stats={[
          { label: 'Actives', value: activeOffers.length },
          { label: 'Total', value: offers.length },
          { label: 'Produits', value: products.length },
        ]}
      />

      {activeOffers.length > 0 ? (
        <section className="rounded-3xl bg-gradient-to-br from-gbandjo-green to-gbandjo-green-dark p-6 text-white shadow-lg sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">Deal en vitrine</p>
          <p className="mt-1 text-lg font-bold">
            {activeOffers[0].product_name ?? 'Offre active'}, {formatFcfa(activeOffers[0].discounted_price)}
          </p>
          <p className="mt-2 text-sm text-white/90">
            {activeOffers.length} offre(s) actuellement publiée(s) sur le marketplace public.
          </p>
        </section>
      ) : null}

      <section className="rounded-3xl border border-gbandjo-border bg-white p-5 shadow-sm sm:p-6">
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
        <form
          className="mb-8 grid gap-4 rounded-2xl border border-gbandjo-border bg-gbandjo-surface/50 p-6 md:grid-cols-2"
          onSubmit={handleCreate}
        >
          <label className="text-sm font-medium">
            Produit
            <select
              className="mt-1 w-full rounded-xl border border-gbandjo-border px-3 py-2.5 text-sm"
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              required
            >
              <option value="">Choisir…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Quantité disponible"
            type="number"
            min={1}
            value={form.available_quantity}
            onChange={(e) => setForm({ ...form, available_quantity: e.target.value })}
          />
          <Input
            label="Prix initial (FCFA)"
            value={form.initial_price}
            onChange={(e) => setForm({ ...form, initial_price: e.target.value })}
            required
          />
          <Input
            label="Prix promotionnel (FCFA)"
            value={form.discounted_price}
            onChange={(e) => setForm({ ...form, discounted_price: e.target.value })}
            required
          />
          <Input
            label="Début"
            type="datetime-local"
            value={form.starts_at}
            onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
            required
          />
          <Input
            label="Fin"
            type="datetime-local"
            value={form.ends_at}
            onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
            required
          />
          <Button type="submit" className="md:col-span-2">
            Publier l&apos;offre
          </Button>
        </form>
        <h2 className="mb-4 text-base font-bold text-gbandjo-ink">Toutes vos offres</h2>
        {isLoading ? (
          <MerchantCardsSkeleton count={3} />
        ) : offers.length === 0 ? (
          <p className="text-sm text-gbandjo-muted">
            Aucune offre pour le moment. Publiez votre première promo avec le formulaire ci dessus.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o) => (
              <MerchantOfferMarketCard
                key={o.id}
                offer={o}
                onDeactivate={o.status === 'ACTIVE' ? () => void handleDeactivate(o.id) : undefined}
                onWithdraw={o.status === 'ACTIVE' ? () => void withdrawMerchantOffer(o.id).then(refreshMerchantData) : undefined}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}