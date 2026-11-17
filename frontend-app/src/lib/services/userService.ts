import { apiClient } from '../api/client'
import type { ApiEnvelope, UserSummary } from '../api/types'

export async function fetchProfile() {
  const { data } = await apiClient.get<ApiEnvelope<{ user: UserSummary }>>('/api/users/profile')
  return data.data.user
}

export async function updateProfile(payload: Partial<UserSummary>) {
  const { data } = await apiClient.patch<ApiEnvelope<{ user: UserSummary }>>('/api/users/profile', payload)
  return data.data.user
}

export async function changePassword(oldPassword: string, newPassword: string) {
  await apiClient.put('/api/users/password', {
    old_password: oldPassword,
    new_password: newPassword,
  })
}