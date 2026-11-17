import { useNavigate } from 'react-router-dom'

import { Icon } from '../icons/Icon'
import { useAuthStore } from '../../stores/authStore'

type AdminTopBarProps = {
  title: string
  breadcrumb?: string
}

export function AdminTopBar({ title, breadcrumb = 'Administration' }: AdminTopBarProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)

  function handleLogout() {
    clearSession()
    navigate('/connexion', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gbandjo-border bg-white px-4 shadow-sm sm:px-8">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gbandjo-muted">{breadcrumb}</p>
        <h1 className="truncate text-lg font-bold text-gbandjo-ink">{title}</h1>
      </div>
      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-gbandjo-border bg-gbandjo-surface px-3 py-2 md:flex">
        <Icon name="search" className="h-4 w-4 shrink-0 text-gbandjo-muted" />
        <input
          type="search"
          placeholder="Rechercher…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-gbandjo-muted"
          aria-label="Recherche"
        />
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl border border-gbandjo-border px-3 py-2 text-sm font-medium text-gbandjo-muted hover:bg-gbandjo-blue-light hover:text-gbandjo-blue"
      >
        Déconnexion
      </button>
      <div className="flex items-center gap-3 rounded-xl border border-gbandjo-border px-3 py-1.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gbandjo-blue text-sm font-bold text-white">
          {user?.first_name?.[0] ?? 'A'}
        </span>
        <div className="hidden text-sm sm:block">
          <p className="font-semibold text-gbandjo-ink">{user?.first_name ?? 'Admin'}</p>
          <p className="text-xs text-gbandjo-muted">Gbandjo</p>
        </div>
      </div>
    </header>
  )
}