import type { ReactNode } from 'react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { DashboardStats } from '../../lib/api/types'

const COLORS = ['#0047FF', '#00A3E0', '#1e293b', '#94a3b8', '#22c55e']

type StatsChartsProps = {
  stats: DashboardStats
}

function dictToChart(data: Record<string, number> | undefined) {
  if (!data) return []
  return Object.entries(data).map(([name, value]) => ({ name, value }))
}

export function StatsCharts({ stats }: StatsChartsProps) {
  const offers = dictToChart(stats.offers_by_status)
  const stores = dictToChart(stats.stores_by_validation_status)
  const users = dictToChart(stats.users_by_role)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ChartCard title="Offres par statut">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={offers}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#0047FF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Commerces (validation)">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={stores} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
              {stores.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Utilisateurs par rôle">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={users} layout="vertical">
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#00A3E0" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-gbandjo-border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-gbandjo-ink">{title}</h2>
      {children}
    </section>
  )
}