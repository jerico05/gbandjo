import { useEffect, useState } from 'react'

import { Pagination } from '../components/ui/Pagination'
import { getApiErrorMessage } from '../lib/api/errors'
import { deactivateAdminOffer, listAdminOffers, withdrawAdminOffer } from '../lib/services/adminService'

type AdminOfferRow = {
  id: number
  product_name?: string
  status: string
  store_name?: string
}

export function AdminOffersPage() {
  const [offers, setOffers] = useState<AdminOfferRow[]>([])
  const [status, setStatus] = useState('ACTIVE')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [hasPrev, setHasPrev] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [error, setError] = useState('')

  async function load(nextPage = page) {
    try {
      const data = await listAdminOffers(status || undefined, nextPage, 15)
      setOffers(data.offers)
      setPage(data.pagination.page)
      setPages(data.pagination.pages)
      setHasPrev(data.pagination.has_prev)
      setHasNext(data.pagination.has_next)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  useEffect(() => {
    void load(1)
  }, [status])

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-xl border border-gbandjo-border px-3 py-2 text-sm"
      >
        <option value="">Toutes</option>
        <option value="ACTIVE">Actives</option>
        <option value="DESACTIVEE">Désactivées</option>
        <option value="RETIREE">Retirées</option>
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {offers.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gbandjo-border bg-white p-4">
            <div>
              <p className="font-semibold">{o.product_name ?? `Offre #${o.id}`}</p>
              <p className="text-sm text-gbandjo-muted">{o.store_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gbandjo-blue">{o.status}</span>
              {o.status === 'ACTIVE' ? (
                <>
                  <button
                    type="button"
                    onClick={() => void deactivateAdminOffer(o.id).then(() => load(page))}
                    className="rounded-lg border border-gbandjo-border px-3 py-1 text-xs"
                  >
                    Désactiver
                  </button>
                  <button
                    type="button"
                    onClick={() => void withdrawAdminOffer(o.id).then(() => load(page))}
                    className="rounded-lg border border-gbandjo-border px-3 py-1 text-xs"
                  >
                    Retirer
                  </button>
                </>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <Pagination page={page} pages={pages} hasPrev={hasPrev} hasNext={hasNext} onPageChange={(p) => void load(p)} />
    </div>
  )
}