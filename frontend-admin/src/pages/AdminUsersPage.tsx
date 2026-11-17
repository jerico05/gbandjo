import { useEffect, useState } from 'react'

import { Pagination } from '../components/ui/Pagination'
import { getApiErrorMessage } from '../lib/api/errors'
import type { UserSummary } from '../lib/api/types'
import { listAdminUsers, updateUserStatus } from '../lib/services/adminService'

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [hasPrev, setHasPrev] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [error, setError] = useState('')

  async function load(nextPage = page) {
    try {
      const data = await listAdminUsers({ q: query || undefined, role: role || undefined, page: nextPage, per_page: 15 })
      setUsers(data.users)
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
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par e-mail, nom…"
          className="min-w-[240px] flex-1 rounded-xl border border-gbandjo-border px-3 py-2 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-gbandjo-border px-3 py-2 text-sm"
        >
          <option value="">Tous les rôles</option>
          <option value="CONSOMMATEUR">Consommateur</option>
          <option value="COMMERCANT">Commerçant</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="button" onClick={() => void load(1)} className="rounded-xl bg-gbandjo-blue px-4 py-2 text-sm font-semibold text-white">
          Rechercher
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-gbandjo-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gbandjo-surface text-xs uppercase text-gbandjo-muted">
            <tr>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gbandjo-border">
                <td className="px-4 py-3">
                  <p className="font-medium">
                    {u.first_name} {u.last_name}
                  </p>
                  <p className="text-xs text-gbandjo-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">{u.account_status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {['ACTIF', 'SUSPENDU', 'DESACTIVE'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => void setStatus(u.id, status)}
                        className="rounded-lg border border-gbandjo-border px-2 py-1 text-xs hover:bg-gbandjo-blue-light"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pages={pages} hasPrev={hasPrev} hasNext={hasNext} onPageChange={(p) => void load(p)} />
    </div>
  )
}