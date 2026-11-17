import { apiClient } from '../api/client'
import type { ApiEnvelope, Store } from '../api/types'

export async function fetchMyStore() {
  const { data } = await apiClient.get<ApiEnvelope<{ store: Store }>>('/api/stores/me')
  return data.data.store
}

export async function createStore(payload: {
  name: string
  description?: string
  activity_type: string
  address: string
  phone?: string
  latitude: number
  longitude: number
}) {
  const { data } = await apiClient.post<ApiEnvelope<{ store: Store }>>('/api/stores/me', payload)
  return data.data.store
}

export async function updateStore(payload: Partial<Store>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ store: Store }>>('/api/stores/me', payload)
  return data.data.store
}