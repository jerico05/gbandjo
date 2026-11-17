import { useEffect, useState } from 'react'

import { getApiErrorMessage } from '../lib/api/errors'
import type { Store } from '../lib/api/types'
import { listAdminStores, rejectStore, validateStore } from '../lib/services/adminService'

export function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [filter, setFilter] = useState('EN_ATTENTE')
  const [error, setError] = useState('')

  async function load() {
    try {
      setStores(await listAdminStores(filter || undefined))
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  useEffect(() => {
    void load()
  }, [filter])

  async function handleValidate(id: number) {
    await validateStore(id)
    await load()
  }

  async function handleReject(id: number) {
    const reason = prompt('Motif du rejet :')
    if (!reason) return
    try {
      await rejectStore(id, reason)
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-xl border border-gbandjo-border px-3 py-2 text-sm"
      >
        <option value="">Tous</option>
        <option value="EN_ATTENTE">En attente</option>
        <option value="VALIDE">Validés</option>
        <option value="REJETE">Rejetés</option>
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-4">
        {stores.map((s) => (
          <li key={s.id} className="rounded-2xl border border-gbandjo-border bg-white p-5">
            <p className="font-bold text-gbandjo-ink">{s.name}</p>
            <p className="text-sm text-gbandjo-muted">
              {s.activity_type}, {s.address}
            </p>
            <p className="mt-1 text-xs font-semibold text-gbandjo-blue">{s.validation_status}</p>
            {s.validation_status === 'EN_ATTENTE' ? (
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => void handleValidate(s.id)} className="rounded-xl bg-gbandjo-blue px-4 py-2 text-sm text-white">
                  Valider
                </button>
                <button type="button" onClick={() => void handleReject(s.id)} className="rounded-xl border border-gbandjo-border px-4 py-2 text-sm">
                  Rejeter
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}