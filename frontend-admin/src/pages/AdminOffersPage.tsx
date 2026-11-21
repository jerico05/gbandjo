import { useEffect, useState } from 'react'
import { AdminWorkspace } from '../components/layout/AdminWorkspace'
import { AdminTableSkeleton } from '../components/ui/AdminTableSkeleton'
import { Badge } from '../components/ui/Badge'
import { AdminViewDetailButton } from '../components/ui/AdminViewDetailButton'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { getApiErrorMessage } from '../lib/api/errors'
import { deactivateAdminOffer, listAdminOffers, withdrawAdminOffer } from '../lib/services/adminService'
import { offerStatusLabel } from '../lib/utils/statusLabels'

type AdminOfferRow = {
  id: number
  product_name?: string
  status: string
  store_name?: string
  store_id?: number
}

function offerTone(status: string): 'green' | 'neutral' | 'red' {
  if (status === 'ACTIVE') return 'green'
  if (status === 'RETIREE') return 'red'
  return 'neutral'
}

export function AdminOffersPage() {
  const [offers, setOffers] = useState<AdminOfferRow[]>([])
  const [status, setStatus] = useState('ACTIVE')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [hasPrev, setHasPrev] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(nextPage = page) {
    setLoading(true)
    try {
      const data = await listAdminOffers(status || undefined, nextPage, 15)
      setOffers(data.offers)
      setPage(data.pagination.page)
      setPages(data.pagination.pages)
      setHasPrev(data.pagination.has_prev)
      setHasNext(data.pagination.has_next)
      setError('')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load(1)
  }, [status])

  return (
    <AdminWorkspace
      title="Offres"
      description="Surveillez les annonces publiées et intervenez en cas d’abus ou de contenu non conforme."
    >
      <div className="rounded-3xl border border-gbandjo-border bg-white p-4 shadow-sm">
        <label className="text-sm font-medium text-gbandjo-muted">
          Statut
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1.5 block rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm text-gbandjo-ink"
          >
            <option value="">Toutes</option>
            <option value="ACTIVE">Actives</option>
            <option value="DESACTIVEE">Désactivées</option>
            <option value="RETIREE">Retirées</option>
          </select>
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {loading && offers.length === 0 ? (
        <AdminTableSkeleton rows={5} />
      ) : offers.length === 0 ? (
        <p className="rounded-3xl border border-gbandjo-border bg-white py-16 text-center text-sm text-gbandjo-muted">
          Aucune offre pour ce filtre.
        </p>
      ) : (
        <ul className="space-y-3">
          {offers.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gbandjo-border bg-white p-5 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <OfferInfo offer={o} />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Badge tone={offerTone(o.status)}>{offerStatusLabel(o.status)}</Badge>
                {o.status === 'ACTIVE' ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => void deactivateAdminOffer(o.id).then(() => load(page))}
                    >
                      Désactiver
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => void withdrawAdminOffer(o.id).then(() => load(page))}
                    >
                      Retirer
                    </Button>
                  </>
                ) : null}
                <AdminViewDetailButton
                  to={`/offres/${o.id}`}
                  label={`Voir l’offre ${o.product_name ?? o.id}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} pages={pages} hasPrev={hasPrev} hasNext={hasNext} onPageChange={(p) => void load(p)} />
    </AdminWorkspace>
  )
}

function OfferInfo({ offer }: { offer: AdminOfferRow }) {
  return (
    <div className="min-w-0">
      <p className="font-semibold text-gbandjo-ink">{offer.product_name ?? `Offre #${offer.id}`}</p>
      <p className="text-sm text-gbandjo-muted">{offer.store_name ?? 'Commerce inconnu'}</p>
    </div>
  )
}