import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { AdminDetailCard, DetailRow } from '../components/admin/AdminDetailCard'
import { AdminWorkspace } from '../components/layout/AdminWorkspace'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { getApiErrorMessage } from '../lib/api/errors'
import type { AdminUserDetail } from '../lib/api/types'
import { fetchAdminUserDetail, updateUserStatus } from '../lib/services/adminService'
import { formatDateTime } from '../lib/utils/format'
import { accountStatusLabel, storeValidationLabel, userRoleLabel } from '../lib/utils/statusLabels'

export function AdminUserDetailPage() {
  const { userId } = useParams()
  const id = Number(userId)
  const [detail, setDetail] = useState<AdminUserDetail | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!id || Number.isNaN(id)) return
    setLoading(true)
    try {
      setDetail(await fetchAdminUserDetail(id))
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

  async function setStatus(account_status: string) {
    if (!detail) return
    try {
      await updateUserStatus(detail.user.id, account_status)
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  if (loading) {
    return (
      <AdminWorkspace title="Profil utilisateur">
        <div className="h-40 animate-pulse rounded-3xl border border-gbandjo-border bg-white" />
      </AdminWorkspace>
    )
  }

  if (error && !detail) {
    return (
      <AdminWorkspace title="Profil utilisateur">
        <p className="text-sm text-red-600">{error}</p>
        <Button href="/utilisateurs" variant="outline">
          Retour
        </Button>
      </AdminWorkspace>
    )
  }

  if (!detail) {
    return null
  }

  const { user, store } = detail

  return (
    <AdminWorkspace
      title={`${user.first_name} ${user.last_name}`}
      description={userRoleLabel(user.role)}
      actions={
        <Button href="/utilisateurs" variant="outline">
          Retour à la liste
        </Button>
      }
    >
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <AdminDetailCard title="Informations du compte">
        <dl>
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Téléphone" value={user.phone ?? '—'} />
          <DetailRow label="Rôle" value={<Badge tone="blue">{userRoleLabel(user.role)}</Badge>} />
          <DetailRow
            label="Statut"
            value={<Badge tone="green">{accountStatusLabel(user.account_status ?? '')}</Badge>}
          />
          <DetailRow
            label="Inscription"
            value={user.created_at ? formatDateTime(user.created_at) : '—'}
          />
        </dl>
        <h3 className="mb-2 mt-6 text-sm font-bold text-gbandjo-ink">Modifier le statut</h3>
        <StatusPicker current={user.account_status} onPick={(s) => void setStatus(s)} />
      </AdminDetailCard>

      {store ? (
        <AdminDetailCard title="Commerce associé">
          <dl>
            <DetailRow
              label="Nom"
              value={
                <Link to={`/commerces/${store.id}`} className="font-semibold text-gbandjo-blue hover:underline">
                  {store.name}
                </Link>
              }
            />
            <DetailRow label="Adresse" value={store.address} />
            <DetailRow label="Activité" value={store.activity_type} />
            <DetailRow label="Validation" value={storeValidationLabel(store.validation_status)} />
          </dl>
          <div className="mt-4">
            <Button href={`/commerces/${store.id}`} variant="outline">
              Voir produits et offres
            </Button>
          </div>
        </AdminDetailCard>
      ) : (
        <AdminDetailCard title="Commerce associé">
          <p className="text-sm text-gbandjo-muted">Aucun commerce lié à ce compte.</p>
        </AdminDetailCard>
      )}
    </AdminWorkspace>
  )
}

function StatusPicker({ current, onPick }: { current?: string; onPick: (status: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(['ACTIF', 'SUSPENDU', 'DESACTIVE'] as const).map((status) => (
        <Button
          key={status}
          type="button"
          variant={current === status ? 'primary' : 'ghost'}
          className="!px-3 !py-1.5 text-xs"
          onClick={() => onPick(status)}
        >
          {accountStatusLabel(status)}
        </Button>
      ))}
    </div>
  )
}