import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Icon } from '../icons/Icon'
import { useAuthStore } from '../../stores/authStore'

type AdminTopBarProps = {
  title: string
  breadcrumb?: string
  onMenuToggle?: () => void
}

export function AdminTopBar({ title, breadcrumb = 'Administration', onMenuToggle }: AdminTopBarProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleLogout() {
    clearSession()
    navigate('/connexion', { replace: true })
  }

  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}` || 'A'

  return (
    <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center gap-3 border-b border-gbandjo-border bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuToggle}
        className="inline-flex rounded-xl border border-gbandjo-border p-2 text-gbandjo-muted hover:bg-gbandjo-surface lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Icon name="menu" className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gbandjo-muted">{breadcrumb}</p>
        <h1 className="truncate text-lg font-extrabold text-gbandjo-ink sm:text-xl">{title}</h1>
      </div>

      <div className="relative ml-auto" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-2xl border border-gbandjo-border bg-white px-2 py-1.5 shadow-sm transition hover:border-gbandjo-blue/30"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gbandjo-blue to-gbandjo-cyan text-sm font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-left text-sm sm:block">
            <span className="block font-semibold text-gbandjo-ink">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="block text-xs text-gbandjo-muted">Administrateur</span>
          </span>
        </button>
        {menuOpen ? (
          <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-2xl border border-gbandjo-border bg-white p-2 shadow-lg">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-gbandjo-muted hover:bg-gbandjo-blue-light hover:text-gbandjo-blue"
            >
              Se déconnecter
            </button>
          </div>
        ) : null}
      </div>
    </header>
  )
}