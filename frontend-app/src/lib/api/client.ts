import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '../../stores/authStore'
import type { ApiEnvelope, AuthTokens } from './types'

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) return null

  const { data } = await axios.post<ApiEnvelope<AuthTokens>>(`${baseURL}/api/auth/refresh`, {
    refresh_token: refreshToken,
  })

  useAuthStore.getState().setSession(data.data)
  return data.data.access_token
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }
      const newToken = await refreshPromise
      if (!newToken) {
        useAuthStore.getState().clearSession()
        return Promise.reject(error)
      }
      original.headers.Authorization = `Bearer ${newToken}`
      return apiClient(original)
    } catch {
      useAuthStore.getState().clearSession()
      return Promise.reject(error)
    }
  },
)