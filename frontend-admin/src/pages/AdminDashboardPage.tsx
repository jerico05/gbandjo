import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AdminKpiCard } from '../components/dashboard/AdminKpiCard'
import { StatsCharts } from '../components/dashboard/StatsCharts'
import { AdminWorkspace } from '../components/layout/AdminWorkspace'
import { Button } from '../components/ui/Button'
import { getApiErrorMessage } from '../lib/api/errors'
import type { DashboardStats } from '../lib/api/types'
import { fetchDashboardStats } from '../lib/services/adminService'
import { useAuthStore } from '../stores/authStore'

const quickLinks = [
  { to: '/commerces', label: 'Commerces en attente', desc: 'Valider ou rejeter les inscriptions' },
  { to: '/offres', label: 'Modérer les offres', desc: 'Retirer les annonces non conformes' },
  { to: '/utilisateurs', label: 'Gérer les comptes', desc: 'Suspendre ou réactiver un profil' },
]

export function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchDashboardStats()
      .then(setStats)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const name = user?.first_name ?? 'Administrateur'

  return (
    <AdminWorkspace>
      <section className="relative overflow-hidden rounded-3xl border border-gbandjo-blue/20 bg-white p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gbandjo-blue/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-gbandjo-cyan/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-gbandjo-muted">Bonjour, {name}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-gbandjo-ink sm:text-3xl">Vue d’ensemble</h2>
            <p className="mt-2 max-w-xl text-sm text-gbandjo-muted">
              Suivez l&apos;activité de la plateforme, la validation des commerces et la santé du catalogue anti gaspi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href="/commerces" variant="outline">
              Commerces à valider
            </Button>
            <Button href="/offres">Modérer les offres</Button>
          </div>
        </div>
      </section>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminKpiCard
          label="Utilisateurs"
          value={stats?.totals?.users ?? 0}
          icon="users"
          to="/utilisateurs"
          loading={loading}
        />
        <AdminKpiCard
          label="Commerces"
          value={stats?.totals?.stores ?? 0}
          icon="store"
          to="/commerces"
          loading={loading}
        />
        <AdminKpiCard
          label="Offres"
          value={stats?.totals?.offers ?? 0}
          icon="tag"
          to="/offres"
          loading={loading}
        />
        <AdminKpiCard
          label="Réservations aujourd’hui"
          value={stats?.reservations_activity ?? 0}
          icon="layout"
          loading={loading}
        />
      </div>

      {stats ? (
        <div>
          <h3 className="mb-4 text-base font-bold text-gbandjo-ink">Répartition</h3>
          <StatsCharts stats={stats} />
        </div>
      ) : loading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl border border-gbandjo-border bg-white" />
          ))}
        </div>
      ) : null}

      <section className="rounded-3xl border border-gbandjo-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-gbandjo-ink">Actions rapides</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {quickLinks.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="block rounded-2xl border border-gbandjo-border bg-gbandjo-surface/50 p-4 transition hover:border-gbandjo-blue/40 hover:bg-white"
              >
                <p className="font-semibold text-gbandjo-ink">{item.label}</p>
                <p className="mt-1 text-xs text-gbandjo-muted">{item.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AdminWorkspace>
  )
}