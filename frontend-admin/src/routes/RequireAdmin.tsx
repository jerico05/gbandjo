import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '../stores/authStore'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/connexion" replace />
  }

  return children
}