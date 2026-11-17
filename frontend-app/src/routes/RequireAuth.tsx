import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '../stores/authStore'

type RequireAuthProps = {
  children: ReactNode
  roles?: string[]
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}