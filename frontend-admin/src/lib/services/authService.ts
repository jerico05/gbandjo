import { apiClient } from '../api/client'
import type { ApiEnvelope, AuthTokens } from '../api/types'

export async function adminLogin(email: string, password: string) {
  const { data } = await apiClient.post<ApiEnvelope<AuthTokens>>('/api/auth/login', { email, password })
  return data.data
}