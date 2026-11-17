import { apiClient } from '../api/client'
import type { ApiEnvelope, NotificationItem, PaginationMeta } from '../api/types'

export async function listNotifications(page = 1, unreadOnly = false) {
  const { data } = await apiClient.get<
    ApiEnvelope<{ notifications: NotificationItem[]; pagination: PaginationMeta; unread_count: number }>
  >('/api/notifications', { params: { page, unread_only: unreadOnly ? 'true' : undefined } })
  return data.data
}

export async function fetchUnreadCount() {
  const data = await listNotifications(1, true)
  return data.unread_count
}

export async function markNotificationRead(notificationId: number) {
  await apiClient.post(`/api/notifications/${notificationId}/read`)
}

export async function markAllNotificationsRead() {
  await apiClient.post('/api/notifications/read-all')
}