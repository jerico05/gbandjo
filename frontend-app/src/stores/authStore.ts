import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthTokens, UserSummary } from '../lib/api/types'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: UserSummary | null
  setSession: (payload: AuthTokens) => void
  setUser: (user: UserSummary) => void
  clearSession: () => void
  isRole: (role: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: (payload) =>
        set({
          accessToken: payload.access_token,
          refreshToken: payload.refresh_token,
          user: payload.user,
        }),
      setUser: (user) => set({ user }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
      isRole: (role) => get().user?.role === role,
    }),
    {
      name: 'gbandjo-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
)