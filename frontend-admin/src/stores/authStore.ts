import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthTokens, UserSummary } from '../lib/api/types'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: UserSummary | null
  setSession: (payload: AuthTokens) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: (payload) =>
        set({
          accessToken: payload.access_token,
          refreshToken: payload.refresh_token,
          user: payload.user,
        }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'gbandjo-admin-auth' },
  ),
)