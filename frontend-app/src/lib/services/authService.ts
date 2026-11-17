import { apiClient } from '../api/client'
import type { ApiEnvelope, AuthTokens } from '../api/types'

export type RegisterPayload = {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthTokens>>('/api/auth/login', payload)
  return data.data
}

export async function registerConsumer(payload: RegisterPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthTokens>>('/api/auth/register/consumer', payload)
  return data.data
}

export async function registerMerchant(payload: RegisterPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthTokens>>('/api/auth/register/merchant', payload)
  return data.data
}

export async function logout(refreshToken: string) {
  await apiClient.post('/api/auth/logout', { refresh_token: refreshToken })
}