import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { AdminSidebar } from '../components/layout/AdminSidebar'
import { AdminTopBar } from '../components/layout/AdminTopBar'

const titles: Record<string, string> = {
  '/tableau-de-bord': 'Tableau de bord',
  '/utilisateurs': 'Utilisateurs',
  '/commerces': 'Validation des commerces',
  '/offres': 'Modération des offres',
}

const breadcrumbs: Record<string, string> = {
  '/tableau-de-bord': 'Vue d’ensemble',
  '/utilisateurs': 'Comptes et accès',
  '/commerces': 'Fiches commerçants',
  '/offres': 'Catalogue public',
}

function resolveMeta(pathname: string) {
  if (pathname.startsWith('/offres/')) return { title: 'Détail de l’offre', breadcrumb: 'Modération' }
  if (pathname.startsWith('/commerces/')) return { title: 'Fiche commerce', breadcrumb: 'Commerces' }
  if (pathname.startsWith('/utilisateurs/')) return { title: 'Profil utilisateur', breadcrumb: 'Utilisateurs' }
  return { title: titles[pathname] ?? 'Administration', breadcrumb: breadcrumbs[pathname] ?? 'Administration' }
}

export function AdminDashboardShell() {
  const { pathname } = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { title: pageTitle, breadcrumb } = resolveMeta(pathname)

  return (
    <div className="min-h-svh bg-gbandjo-surface">
      <AdminSidebar className="fixed inset-y-0 left-0 z-30 hidden lg:flex" />
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer le menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <AdminSidebar className="relative z-10 shadow-2xl" onNavigate={() => setMobileNavOpen(false)} />
        </div>
      ) : null}

      <div className="flex min-h-svh min-w-0 flex-col lg:ml-64">
        <AdminTopBar
          title={pageTitle}
          breadcrumb={breadcrumb}
          onMenuToggle={() => setMobileNavOpen((o) => !o)}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}