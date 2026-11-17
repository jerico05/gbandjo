import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '../../stores/authStore'
import type { ApiEnvelope, AuthTokens } from './types'

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise: Promise<string | null> | null = null

apiClient.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }
    original._retry = true
  try {
    const refreshToken = useAuthStore.getState().refreshToken
    if (!refreshToken) {
      useAuthStore.getState().clearSession()
      return Promise.reject(error)
    }
    if (!refreshPromise) {
      refreshPromise = axios
        .post<ApiEnvelope<AuthTokens>>(`${baseURL}/api/auth/refresh`, { refresh_token: refreshToken })
        .then((res) => {
          useAuthStore.getState().setSession(res.data.data)
          return res.data.data.access_token
        })
        .finally(() => {
          refreshPromise = null
        })
    }
    const newToken = await refreshPromise
    if (!newToken) return Promise.reject(error)
    original.headers.Authorization = `Bearer ${newToken}`
    return apiClient(original)
  } catch {
    useAuthStore.getState().clearSession()
    return Promise.reject(error)
  }
  },
)