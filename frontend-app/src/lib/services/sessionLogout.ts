import { logout } from './authService'
import { useAuthStore } from '../../stores/authStore'

/** Déconnecte la session locale (et le refresh token côté API si présent). */
export async function logoutCurrentSession() {
  const { refreshToken, clearSession } = useAuthStore.getState()
  if (refreshToken) {
    try {
      await logout(refreshToken)
    } catch {
      /* ignore réseau */
    }
  }
  clearSession()
}