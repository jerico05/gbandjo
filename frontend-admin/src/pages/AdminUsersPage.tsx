import { useEffect, useState } from 'react'
import { AdminWorkspace } from '../components/layout/AdminWorkspace'
import { AdminTableSkeleton } from '../components/ui/AdminTableSkeleton'
import { Badge } from '../components/ui/Badge'
import { AdminViewDetailButton } from '../components/ui/AdminViewDetailButton'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { Icon } from '../components/icons/Icon'
import { getApiErrorMessage } from '../lib/api/errors'
import type { UserSummary } from '../lib/api/types'
import { listAdminUsers, updateUserStatus } from '../lib/services/adminService'
import { accountStatusLabel, userRoleLabel } from '../lib/utils/statusLabels'

function statusTone(status: string): 'green' | 'orange' | 'red' | 'neutral' {
  if (status === 'ACTIF') return 'green'
  if (status === 'SUSPENDU') return 'orange'
  if (status === 'DESACTIVE') return 'red'
  return 'neutral'
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [hasPrev, setHasPrev] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(nextPage = page) {
    setLoading(true)
    try {
      const data = await listAdminUsers({ q: query || undefined, role: role || undefined, page: nextPage, per_page: 15 })
      setUsers(data.users)
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
  }, [role])

  async function setStatus(userId: number, account_status: string) {
    try {
      await updateUserStatus(userId, account_status)
      await load(page)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <AdminWorkspace
      title="Utilisateurs"
      description="Recherchez un compte, consultez son rôle et ajustez le statut d’accès."
    >
      <div className="flex flex-col gap-3 rounded-3xl border border-gbandjo-border bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-gbandjo-border bg-gbandjo-surface px-3 py-2">
          <Icon name="search" className="h-4 w-4 text-gbandjo-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void load(1)
            }}
            placeholder="Email, nom, prénom…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Tous les rôles</option>
          <option value="CONSOMMATEUR">Consommateur</option>
          <option value="COMMERCANT">Commerçant</option>
          <option value="ADMIN">Administrateur</option>
        </select>
        <Button type="button" onClick={() => void load(1)}>
          Rechercher
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {loading && users.length === 0 ? (
        <AdminTableSkeleton rows={6} />
      ) : users.length === 0 ? (
        <p className="rounded-3xl border border-gbandjo-border bg-white py-16 text-center text-sm text-gbandjo-muted">
          Aucun utilisateur ne correspond à votre recherche.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-gbandjo-border bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-gbandjo-surface text-xs font-semibold uppercase tracking-wide text-gbandjo-muted">
              <tr>
                <th className="px-5 py-4">Utilisateur</th>
                <th className="px-5 py-4">Rôle</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Actions</th>
                <th className="w-16 px-3 py-4 text-center">Voir</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gbandjo-border hover:bg-gbandjo-surface/40">
                <td className="px-5 py-4">
                  <p className="font-semibold text-gbandjo-ink">
                    {u.first_name} {u.last_name}
                  </p>
                  <p className="text-xs text-gbandjo-muted">{u.email}</p>
                </td>
                  <td className="px-5 py-4">
                    <Badge tone="blue">{userRoleLabel(u.role)}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={statusTone(u.account_status ?? '')}>
                      {accountStatusLabel(u.account_status ?? '')}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(['ACTIF', 'SUSPENDU', 'DESACTIVE'] as const).map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant={u.account_status === status ? 'primary' : 'ghost'}
                          className="!px-2.5 !py-1.5 text-xs"
                          onClick={() => void setStatus(u.id, status)}
                        >
                          {accountStatusLabel(status)}
                        </Button>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center">
                      <AdminViewDetailButton
                        to={`/utilisateurs/${u.id}`}
                        label={`Voir ${u.first_name} ${u.last_name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pages={pages} hasPrev={hasPrev} hasNext={hasNext} onPageChange={(p) => void load(p)} />
    </AdminWorkspace>
  )
}