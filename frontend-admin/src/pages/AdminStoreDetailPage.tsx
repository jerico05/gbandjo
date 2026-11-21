import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { AdminDetailCard, DetailRow } from '../components/admin/AdminDetailCard'
import { AdminImageGallery } from '../components/admin/AdminImageGallery'
import { AdminWorkspace } from '../components/layout/AdminWorkspace'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { getApiErrorMessage } from '../lib/api/errors'
import type { AdminStoreDetail } from '../lib/api/types'
import { fetchAdminStoreDetail, rejectStore, validateStore } from '../lib/services/adminService'
import { formatDateTime, formatEuro } from '../lib/utils/format'
import {
  accountStatusLabel,
  offerStatusLabel,
  storeValidationLabel,
  userRoleLabel,
} from '../lib/utils/statusLabels'

export function AdminStoreDetailPage() {
  const { storeId } = useParams()
  const id = Number(storeId)
  const [detail, setDetail] = useState<AdminStoreDetail | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!id || Number.isNaN(id)) return
    setLoading(true)
    try {
      setDetail(await fetchAdminStoreDetail(id))
      setError('')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [id])

  if (loading) {
    return (
      <AdminWorkspace title="Fiche commerce">
        <div className="h-56 animate-pulse rounded-3xl border border-gbandjo-border bg-white" />
      </AdminWorkspace>
    )
  }

  if (error || !detail) {
    return (
      <AdminWorkspace title="Fiche commerce">
        <p className="text-sm text-red-600">{error || 'Commerce introuvable.'}</p>
        <Button href="/commerces" variant="outline">
          Retour
        </Button>
      </AdminWorkspace>
    )
  }

  const { store, owner, products, offers } = detail

  async function handleValidate() {
    await validateStore(store.id)
    await load()
  }

  async function handleReject() {
    const reason = prompt('Motif du rejet :')
    if (!reason) return
    await rejectStore(store.id, reason)
    await load()
  }

  return (
    <AdminWorkspace
      title={store.name}
      description={store.activity_type}
      actions={
        <>
          <Button href="/commerces" variant="outline">
            Retour
          </Button>
          {store.validation_status === 'EN_ATTENTE' ? (
            <>
              <Button type="button" onClick={() => void handleValidate()}>
                Valider
              </Button>
              <Button type="button" variant="danger" onClick={() => void handleReject()}>
                Rejeter
              </Button>
            </>
          ) : null}
        </>
      }
    >
      <AdminDetailCard title="Informations du commerce">
        <dl>
          <DetailRow label="Statut" value={<Badge tone="blue">{storeValidationLabel(store.validation_status)}</Badge>} />
          <DetailRow label="Adresse" value={store.address} />
          <DetailRow label="Activité" value={store.activity_type} />
          <DetailRow label="Téléphone" value={store.phone ?? '—'} />
          <DetailRow label="Description" value={store.description?.trim() || '—'} />
          <DetailRow
            label="Coordonnées"
            value={
              store.latitude != null && store.longitude != null
                ? `${store.latitude}, ${store.longitude}`
                : '—'
            }
          />
          <DetailRow
            label="Créé le"
            value={store.created_at ? formatDateTime(store.created_at) : '—'}
          />
          {store.rejection_reason ? (
            <DetailRow label="Motif de rejet" value={store.rejection_reason} />
          ) : null}
        </dl>
      </AdminDetailCard>

      {owner ? (
        <AdminDetailCard title="Commerçant propriétaire">
          <dl>
            <DetailRow
              label="Identité"
              value={
                <Link to={`/utilisateurs/${owner.id}`} className="font-semibold text-gbandjo-blue hover:underline">
                  {owner.first_name} {owner.last_name}
                </Link>
              }
            />
            <DetailRow label="Email" value={owner.email} />
            <DetailRow label="Téléphone" value={owner.phone ?? '—'} />
            <DetailRow label="Rôle" value={userRoleLabel(owner.role)} />
            <DetailRow label="Statut compte" value={accountStatusLabel(owner.account_status ?? '')} />
          </dl>
        </AdminDetailCard>
      ) : null}

      <AdminDetailCard title={`Produits (${products.length})`}>
        {products.length === 0 ? (
          <p className="text-sm text-gbandjo-muted">Aucun produit enregistré pour ce commerce.</p>
        ) : (
          <ul className="space-y-6">
            {products.map((product) => (
              <li key={product.id} className="rounded-2xl border border-gbandjo-border bg-gbandjo-surface/40 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <ProductHeader product={product} />
                </div>
                <AdminImageGallery images={product.images} title="Images" />
              </li>
            ))}
          </ul>
        )}
      </AdminDetailCard>

      <AdminDetailCard title={`Offres (${offers.length})`}>
        {offers.length === 0 ? (
          <p className="text-sm text-gbandjo-muted">Aucune offre publiée.</p>
        ) : (
          <ul className="divide-y divide-gbandjo-border">
            {offers.map((offer) => (
              <li key={offer.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <Link to={`/offres/${offer.id}`} className="font-semibold text-gbandjo-blue hover:underline">
                    {offer.product_name ?? `Offre #${offer.id}`}
                  </Link>
                  <p className="text-sm text-gbandjo-muted">
                    {formatEuro(offer.discounted_price)} ({offer.discount_percentage} % de réduction)
                  </p>
                </div>
                <Badge tone="green">{offerStatusLabel(offer.status)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </AdminDetailCard>
    </AdminWorkspace>
  )
}

function ProductHeader({ product }: { product: AdminStoreDetail['products'][number] }) {
  return (
    <div>
      <p className="font-bold text-gbandjo-ink">{product.name}</p>
      <p className="text-xs text-gbandjo-muted">
        {product.category_name ?? 'Sans catégorie'} · {product.is_active ? 'Actif' : 'Inactif'} · {product.images.length}{' '}
        image(s)
      </p>
    </div>
  )
}