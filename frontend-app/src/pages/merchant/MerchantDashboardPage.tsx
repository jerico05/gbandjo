import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Icon } from '../../components/icons/Icon'
import { MerchantKpiCard } from '../../components/merchant/MerchantKpiCard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ReservationStatusBadge } from '../../components/ui/StatusBadge'
import type { Store } from '../../lib/api/types'
import {
  useMerchantOffers,
  useMerchantProducts,
  useMerchantReservations,
  merchantKeys,
  useMerchantStore,
} from '../../lib/hooks/useMerchant'
import { formatFcfa } from '../../lib/utils/formatMoney'
import { storeValidationLabel, storeValidationTone } from '../../lib/utils/storeStatus'
import { useAuthStore } from '../../stores/authStore'
import { MerchantStoreSection } from './MerchantStoreSection'

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const quickActions = [
  { to: '/mon-commerce/produits', label: 'Gérer les produits', icon: 'products' as const, desc: 'Catalogue et images' },
  { to: '/mon-commerce/offres', label: 'Créer une offre', icon: 'offers' as const, desc: 'Prix et disponibilité' },
  { to: '/mon-commerce/reservations', label: 'Réservations', icon: 'reservations' as const, desc: 'Confirmer les réservations' },
  { to: '/mon-commerce/notifications', label: 'Notifications', icon: 'bell' as const, desc: 'Alertes et messages' },
]

export function MerchantDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const storeQuery = useMerchantStore()
  const offersQuery = useMerchantOffers()
  const reservationsQuery = useMerchantReservations()
  const productsQuery = useMerchantProducts()

  const store: Store | null = storeQuery.data ?? null
  const storeError = storeQuery.isError ? 'Aucun commerce enregistré pour ce compte.' : ''
  const offers = offersQuery.data ?? []
  const reservations = reservationsQuery.data ?? []
  const productCount = productsQuery.data?.length ?? 0
  const loading =
    (offersQuery.isLoading && !offersQuery.data) ||
    (reservationsQuery.isLoading && !reservationsQuery.data) ||
    (productsQuery.isLoading && !productsQuery.data)

  const stats = useMemo(() => {
    const activeOffers = offers.filter((o) => o.status === 'ACTIVE').length
    const pending = reservations.filter((r) => r.status === 'EN_ATTENTE').length
    const confirmed = reservations.filter((r) => r.status === 'CONFIRMEE').length
    const revenue = reservations
      .filter((r) => r.status === 'CONFIRMEE' || r.status === 'RETIREE')
      .reduce((sum, r) => sum + Number(r.unit_price) * r.quantity, 0)
    return { activeOffers, pending, confirmed, revenue, totalReservations: reservations.length }
  }, [offers, reservations])

  const recentReservations = useMemo(
    () =>
      [...reservations]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
    [reservations],
  )

  const activeOffersPreview = useMemo(
    () => offers.filter((o) => o.status === 'ACTIVE').slice(0, 4),
    [offers],
  )

  const greetingName = user?.first_name ?? 'Commerçant'
  const displayValue = (n: number) => (loading ? '…' : String(n))

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-gbandjo-green/20 bg-white p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gbandjo-green/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-gbandjo-orange/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-gbandjo-muted">Bonjour, {greetingName}</p>
            <h1 className="mt-1 text-2xl font-extrabold text-gbandjo-ink sm:text-3xl">
              {store?.name ?? 'Votre espace commerçant'}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gbandjo-muted">
              Pilotez vos produits, vos offres anti gaspi et les réservations de vos clients depuis un seul tableau de
              bord.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {store ? (
                <Badge tone={storeValidationTone(store.validation_status)}>
                  {storeValidationLabel(store.validation_status)}
                </Badge>
              ) : (
                <Badge tone="orange">Complétez votre fiche commerce</Badge>
              )}
              {stats.pending > 0 ? (
                <Badge tone="orange">{stats.pending} réservation(s) en attente</Badge>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button href="/mon-commerce/offres">Nouvelle offre</Button>
            <Button variant="outline" href="/mon-commerce/produits">
              Ajouter un produit
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MerchantKpiCard
          label="Produits au catalogue"
          value={displayValue(productCount)}
          icon="products"
          to="/mon-commerce/produits"
          accent="neutral"
        />
        <MerchantKpiCard
          label="Offres actives"
          value={displayValue(stats.activeOffers)}
          hint={`${offers.length} offre(s) au total`}
          icon="offers"
          to="/mon-commerce/offres"
        />
        <MerchantKpiCard
          label="En attente"
          value={displayValue(stats.pending)}
          hint="À confirmer ou rejeter"
          icon="reservations"
          to="/mon-commerce/reservations"
          accent="orange"
        />
        <MerchantKpiCard
          label="Chiffre estimé"
          value={loading ? '…' : formatFcfa(stats.revenue)}
          hint={`${stats.confirmed} confirmée(s), ${stats.totalReservations} au total`}
          icon="sparkle"
          accent="green"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <section className="rounded-3xl border border-gbandjo-border bg-white shadow-sm xl:col-span-3">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gbandjo-border px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-bold text-gbandjo-ink">Réservations récentes</h2>
              <p className="text-xs text-gbandjo-muted">Les dernières demandes de vos clients</p>
            </div>
            <Link
              to="/mon-commerce/reservations"
              className="text-sm font-semibold text-gbandjo-green hover:underline"
            >
              Tout voir
            </Link>
          </header>
          {recentReservations.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gbandjo-muted">
              {loading ? 'Chargement…' : 'Aucune réservation pour le moment.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gbandjo-border text-xs font-semibold uppercase tracking-wide text-gbandjo-muted">
                    <th className="px-6 py-3 font-semibold">Offre</th>
                    <th className="px-4 py-3 font-semibold">Qté</th>
                    <th className="px-4 py-3 font-semibold">Montant</th>
                    <th className="px-4 py-3 font-semibold">Statut</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((r) => (
                    <tr key={r.id} className="border-b border-gbandjo-border/80 last:border-0 hover:bg-gbandjo-surface/60">
                      <td className="max-w-[200px] truncate px-6 py-3.5 font-medium text-gbandjo-ink">
                        {r.offer_label ?? `Offre #${r.offer_id}`}
                      </td>
                      <td className="px-4 py-3.5 tabular-nums text-gbandjo-muted">{r.quantity}</td>
                      <td className="px-4 py-3.5 font-semibold tabular-nums text-gbandjo-ink">
                        {formatFcfa(Number(r.unit_price) * r.quantity, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3.5">
                        <ReservationStatusBadge status={r.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5 text-xs text-gbandjo-muted">
                        {formatShortDate(r.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-gbandjo-border bg-white shadow-sm xl:col-span-2">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gbandjo-border px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-bold text-gbandjo-ink">Offres en ligne</h2>
              <p className="text-xs text-gbandjo-muted">Visibles sur le catalogue public</p>
            </div>
            <Link to="/mon-commerce/offres" className="text-sm font-semibold text-gbandjo-green hover:underline">
              Gérer
            </Link>
          </header>
          <ul className="divide-y divide-gbandjo-border">
            {activeOffersPreview.length === 0 ? (
              <li className="px-6 py-10 text-center text-sm text-gbandjo-muted">
                {loading ? 'Chargement…' : 'Publiez une offre pour apparaître dans le catalogue.'}
              </li>
            ) : (
              activeOffersPreview.map((o) => (
                <li key={o.id} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gbandjo-green-light text-gbandjo-green">
                    <Icon name="offers" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gbandjo-ink">
                      {o.product_name ?? `Produit #${o.product_id}`}
                    </p>
                    <p className="text-xs text-gbandjo-muted">
                      {formatFcfa(o.discounted_price)}, qté {o.available_quantity}
                    </p>
                  </div>
                  <Badge tone="green" className="shrink-0">
                    Active
                  </Badge>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gbandjo-muted">Raccourcis</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-3 rounded-2xl border border-gbandjo-border bg-white p-4 shadow-sm transition hover:border-gbandjo-green/30 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gbandjo-surface text-gbandjo-green transition group-hover:bg-gbandjo-green-light">
                <Icon name={action.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gbandjo-ink">{action.label}</p>
                <p className="text-xs text-gbandjo-muted">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {storeError && !store ? (
        <p className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">{storeError}</p>
      ) : null}

      <MerchantStoreSection
        store={store}
        onUpdated={(updated) => queryClient.setQueryData(merchantKeys.store, updated)}
        variant="dashboard"
      />
    </div>
  )
}