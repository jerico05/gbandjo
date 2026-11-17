export type ApiEnvelope<T> = {
  data: T
  message?: string
  errors?: unknown
}

export type UserRole = 'CONSOMMATEUR' | 'COMMERCANT' | 'ADMIN'

export type UserSummary = {
  id: number
  last_name: string
  first_name: string
  email: string
  phone?: string | null
  role: UserRole | string
  account_status?: string
  created_at?: string
}

export type AuthTokens = {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserSummary
}

export type ConsumerOffer = {
  id: number
  initial_price: string
  discounted_price: string
  discount_percentage: string
  available_quantity: number
  starts_at: string
  ends_at: string
  expiry_date?: string | null
  status: string
  distance_km?: number | null
  product?: {
    name?: string
    image_url?: string | null
    category_name?: string | null
  }
  store?: {
    name?: string
    city?: string | null
    address?: string | null
  }
}

export type Category = {
  id: number
  name: string
  slug?: string
}

export type Reservation = {
  id: number
  offer_id: number
  offer_label?: string | null
  consumer_id: number
  quantity: number
  unit_price: string
  status: string
  created_at: string
  expires_at: string
  processed_at?: string | null
  reason?: string | null
}

export type Store = {
  id: number
  owner_id: number
  name: string
  description?: string | null
  activity_type: string
  address: string
  phone?: string | null
  latitude: number
  longitude: number
  validation_status: string
  rejection_reason?: string | null
  created_at?: string
}

export type Product = {
  id: number
  store_id: number
  category_id: number
  category_name?: string | null
  name: string
  description?: string | null
  is_active: boolean
  images?: Array<{ id: number; url: string; sort_order: number }>
}

export type MerchantOffer = {
  id: number
  product_id: number
  product_name?: string | null
  initial_price: string
  discounted_price: string
  discount_percentage: string
  available_quantity: number
  starts_at: string
  ends_at: string
  expiry_date?: string | null
  status: string
}

export type NotificationItem = {
  id: number
  type: string
  message: string
  is_read: boolean
  reservation_id?: number | null
  created_at: string
}

export type PaginationMeta = {
  page: number
  per_page: number
  total: number
  pages: number
  has_next: boolean
  has_prev: boolean
}