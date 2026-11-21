import { apiClient } from '../api/client'
import type {
  AdminOfferDetail,
  AdminStoreDetail,
  AdminUserDetail,
  ApiEnvelope,
  DashboardStats,
  PaginationMeta,
  Store,
  UserSummary,
} from '../api/types'

export async function fetchDashboardStats() {
  const { data } = await apiClient.get<ApiEnvelope<{ stats: DashboardStats }>>('/api/admin/dashboard/stats')
  return data.data.stats
}

export async function listAdminUsers(params?: { q?: string; role?: string; page?: number; per_page?: number }) {
  const { data } = await apiClient.get<
    ApiEnvelope<{ users: UserSummary[]; pagination: PaginationMeta }>
  >('/api/admin/users', { params })
  return data.data
}

export async function updateUserStatus(userId: number, account_status: string) {
  const { data } = await apiClient.patch<ApiEnvelope<{ user: UserSummary }>>(`/api/admin/users/${userId}/status`, {
    account_status,
  })
  return data.data.user
}

export async function listAdminStores(validation_status?: string) {
  const { data } = await apiClient.get<ApiEnvelope<{ stores: Store[] }>>('/api/admin/stores', {
    params: validation_status ? { validation_status } : undefined,
  })
  return data.data.stores
}

export async function validateStore(storeId: number) {
  const { data } = await apiClient.post<ApiEnvelope<{ store: Store }>>(`/api/admin/stores/${storeId}/validate`)
  return data.data.store
}

export async function rejectStore(storeId: number, rejection_reason: string) {
  const { data } = await apiClient.post<ApiEnvelope<{ store: Store }>>(`/api/admin/stores/${storeId}/reject`, {
    rejection_reason,
  })
  return data.data.store
}

export async function listAdminOffers(status?: string, page = 1, per_page = 20) {
  const { data } = await apiClient.get<
    ApiEnvelope<{
      offers: Array<{
        id: number
        product_name?: string
        status: string
        store_name?: string
        store_id?: number
      }>
      pagination: PaginationMeta
    }>
  >('/api/admin/offers', { params: { status: status || undefined, page, per_page } })
  return data.data
}

export async function fetchAdminOfferDetail(offerId: number) {
  const { data } = await apiClient.get<ApiEnvelope<{ offer: AdminOfferDetail }>>(`/api/admin/offers/${offerId}`)
  return data.data.offer
}

export async function fetchAdminStoreDetail(storeId: number) {
  const { data } = await apiClient.get<ApiEnvelope<AdminStoreDetail>>(`/api/admin/stores/${storeId}`)
  return data.data
}

export async function fetchAdminUserDetail(userId: number) {
  const { data } = await apiClient.get<ApiEnvelope<AdminUserDetail>>(`/api/admin/users/${userId}`)
  return data.data
}

export async function deactivateAdminOffer(offerId: number) {
  await apiClient.post(`/api/admin/offers/${offerId}/deactivate`)
}

export async function withdrawAdminOffer(offerId: number) {
  await apiClient.post(`/api/admin/offers/${offerId}/withdraw`)
}