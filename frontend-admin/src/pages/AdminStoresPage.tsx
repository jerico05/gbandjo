import { useEffect, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { AdminWorkspace } from '../components/layout/AdminWorkspace'
import { AdminTableSkeleton } from '../components/ui/AdminTableSkeleton'
import { Badge } from '../components/ui/Badge'
import { AdminViewDetailButton } from '../components/ui/AdminViewDetailButton'
import { Button } from '../components/ui/Button'
import { getApiErrorMessage } from '../lib/api/errors'
import type { Store } from '../lib/api/types'
import { listAdminStores, rejectStore, validateStore } from '../lib/services/adminService'
import { storeValidationLabel } from '../lib/utils/statusLabels'

function validationTone(status: string): 'orange' | 'green' | 'red' | 'neutral' {
  if (status === 'EN_ATTENTE') return 'orange'
  if (status === 'VALIDE') return 'green'
  if (status === 'REJETE') return 'red'
  return 'neutral'
}

export function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [filter, setFilter] = useState('EN_ATTENTE')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      setStores(await listAdminStores(filter || undefined))
      setError('')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
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
    <AdminWorkspace
      title="Commerces"
      description="Contrôlez les fiches commerçants avant leur publication sur le marketplace."
    >
      <StoreFilterRow filter={filter} onChange={setFilter} />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <AdminTableSkeleton rows={4} />
      ) : stores.length === 0 ? (
        <p className="rounded-3xl border border-gbandjo-border bg-white py-16 text-center text-sm text-gbandjo-muted">
          Aucun commerce pour ce filtre.
        </p>
      ) : (
        <ul className="grid gap-4">
          {stores.map((s) => (
            <li
              key={s.id}
              className="rounded-3xl border border-gbandjo-border bg-white p-5 shadow-sm transition hover:border-gbandjo-blue/25"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-gbandjo-ink">{s.name}</p>
                  <p className="mt-1 text-sm text-gbandjo-muted">
                    {s.activity_type}, {s.address}
                  </p>
                </div>
                <Badge tone={validationTone(s.validation_status)}>{storeValidationLabel(s.validation_status)}</Badge>
                <AdminViewDetailButton to={`/commerces/${s.id}`} label={`Voir ${s.name}`} />
              </div>
              {s.validation_status === 'EN_ATTENTE' ? (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-gbandjo-border pt-4">
                  <Button type="button" onClick={() => void handleValidate(s.id)}>
                    Valider le commerce
                  </Button>
                  <Button type="button" variant="danger" onClick={() => void handleReject(s.id)}>
                    Rejeter
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </AdminWorkspace>
  )
}

function StoreFilterRow({ filter, onChange }: { filter: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-gbandjo-border bg-white p-4 shadow-sm">
      <span className="inline-flex items-center gap-2 text-sm font-medium text-gbandjo-muted">
        <Icon name="search" className="h-4 w-4" />
        Filtre
      </span>
      <select
        value={filter}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm"
      >
        <option value="">Tous</option>
        <option value="EN_ATTENTE">En attente</option>
        <option value="VALIDE">Validés</option>
        <option value="REJETE">Rejetés</option>
      </select>
    </div>
  )
}