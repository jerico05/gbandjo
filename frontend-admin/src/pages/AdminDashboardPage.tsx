import { useEffect, useState } from 'react'

import { StatsCharts } from '../components/dashboard/StatsCharts'
import { getApiErrorMessage } from '../lib/api/errors'
import type { DashboardStats } from '../lib/api/types'
import { fetchDashboardStats } from '../lib/services/adminService'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetchDashboardStats()
      .then(setStats)
      .catch((err) => setError(getApiErrorMessage(err)))
  }, [])

  const kpis = stats
    ? [
        { label: 'Utilisateurs', value: stats.totals?.users ?? 0 },
        { label: 'Commerces', value: stats.totals?.stores ?? 0 },
        { label: 'Offres', value: stats.totals?.offers ?? 0 },
        { label: 'Réservations aujourd’hui', value: stats.reservations_activity ?? 0 },
      ]
    : []

  return (
    <div className="space-y-6 p-4 sm:p-8">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-2xl border border-gbandjo-border bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gbandjo-muted">{kpi.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-gbandjo-blue">{kpi.value}</p>
          </article>
        ))}
      </div>
      {stats ? <StatsCharts stats={stats} /> : null}
    </div>
  )
}