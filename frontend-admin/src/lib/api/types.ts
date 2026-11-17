export type ApiEnvelope<T> = {
  data: T
  message?: string
}

export type UserSummary = {
  id: number
  last_name: string
  first_name: string
  email: string
  phone?: string | null
  role: string
  account_status?: string
}

export type AuthTokens = {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserSummary
}

export type Store = {
  id: number
  name: string
  validation_status: string
  address: string
  activity_type: string
  rejection_reason?: string | null
}

export type PaginationMeta = {
  page: number
  per_page: number
  total: number
  pages: number
  has_next: boolean
  has_prev: boolean
}

export type DashboardStats = {
  totals: Record<string, number>
  users_by_role: Record<string, number>
  users_by_account_status: Record<string, number>
  stores_by_validation_status: Record<string, number>
  offers_by_status: Record<string, number>
  reservations_activity: number
}