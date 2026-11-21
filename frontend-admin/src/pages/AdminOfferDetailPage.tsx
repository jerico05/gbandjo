import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { AdminDetailCard, DetailRow } from '../components/admin/AdminDetailCard'
import { AdminImageGallery } from '../components/admin/AdminImageGallery'
import { AdminWorkspace } from '../components/layout/AdminWorkspace'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { getApiErrorMessage } from '../lib/api/errors'
import type { AdminOfferDetail } from '../lib/api/types'
import { deactivateAdminOffer, fetchAdminOfferDetail, withdrawAdminOffer } from '../lib/services/adminService'
import { formatDateTime, formatEuro } from '../lib/utils/format'
import { offerStatusLabel, storeValidationLabel } from '../lib/utils/statusLabels'

export function AdminOfferDetailPage() {
  const { offerId } = useParams()
  const id = Number(offerId)
  const [offer, setOffer] = useState<AdminOfferDetail | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!id || Number.isNaN(id)) return
    setLoading(true)
    try {
      setOffer(await fetchAdminOfferDetail(id))
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
      <AdminWorkspace title="Détail de l’offre">
        <div className="h-48 animate-pulse rounded-3xl border border-gbandjo-border bg-white" />
      </AdminWorkspace>
    )
  }

  if (error || !offer) {
    return (
      <AdminWorkspace title="Détail de l’offre">
        <p className="text-sm text-red-600">{error || 'Offre introuvable.'}</p>
        <Button href="/offres" variant="outline">
          Retour aux offres
        </Button>
      </AdminWorkspace>
    )
  }

  return (
    <AdminWorkspace
      title={offer.product.name}
      description={`Offre #${offer.id} · ${offerStatusLabel(offer.status)}`}
      actions={
        <>
          <Button href="/offres" variant="outline">
            Retour
          </Button>
          {offer.status === 'ACTIVE' ? (
            <>
              <Button type="button" variant="outline" onClick={() => void deactivateAdminOffer(offer.id).then(load)}>
                Désactiver
              </Button>
              <Button type="button" variant="danger" onClick={() => void withdrawAdminOffer(offer.id).then(load)}>
                Retirer
              </Button>
            </>
          ) : null}
        </>
      }
    >
      <OfferMetrics offer={offer} />

      <AdminDetailCard title="Produit">
        <dl>
          <DetailRow label="Nom" value={offer.product.name} />
          <DetailRow label="Catégorie" value={offer.product.category_name ?? '—'} />
          <DetailRow label="Description" value={offer.product.description?.trim() || 'Aucune description'} />
        </dl>
        <div className="mt-6 border-t border-gbandjo-border pt-6">
          <AdminImageGallery images={offer.product.images} />
        </div>
      </AdminDetailCard>

      <AdminDetailCard title="Commerce">
        <dl>
          <DetailRow
            label="Nom"
            value={
              <Link to={`/commerces/${offer.store.id}`} className="font-semibold text-gbandjo-blue hover:underline">
                {offer.store.name}
              </Link>
            }
          />
          <DetailRow label="Adresse" value={offer.store.address} />
          <DetailRow label="Téléphone" value={offer.store.phone ?? '—'} />
          {offer.store.validation_status ? (
            <DetailRow
              label="Validation"
              value={<Badge tone="blue">{storeValidationLabel(offer.store.validation_status)}</Badge>}
            />
          ) : null}
        </dl>
      </AdminDetailCard>
    </AdminWorkspace>
  )
}

function OfferMetrics({ offer }: { offer: AdminOfferDetail }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricTile label="Prix initial" value={formatEuro(offer.initial_price)} />
      <MetricTile label="Prix promo" value={formatEuro(offer.discounted_price)} highlight />
      <MetricTile label="Réduction" value={`${offer.discount_percentage} %`} />
      <MetricTile label="Stock" value={String(offer.available_quantity)} />
      <MetricTile label="Début" value={formatDateTime(offer.starts_at)} />
      <MetricTile label="Fin" value={formatDateTime(offer.ends_at)} />
      <MetricTile label="Péremption" value={offer.expiry_date ? formatDateTime(offer.expiry_date) : '—'} />
      <MetricTile label="Statut" value={offerStatusLabel(offer.status)} />
    </div>
  )
}

function MetricTile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-gbandjo-border bg-white p-4 ${
        highlight ? 'border-gbandjo-blue/30 bg-gbandjo-blue-light/40' : ''
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gbandjo-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-gbandjo-ink">{value}</p>
    </div>
  )
}