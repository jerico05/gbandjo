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
  created_at?: string
}

export type AuthTokens = {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserSummary
}

export type Store = {
  id: number
  owner_id?: number
  name: string
  description?: string | null
  validation_status: string
  address: string
  activity_type: string
  phone?: string | null
  latitude?: number
  longitude?: number
  rejection_reason?: string | null
  created_at?: string
}

export type ProductImage = {
  id: number
  url: string
  sort_order: number
}

export type AdminProduct = {
  id: number
  store_id: number
  category_id: number
  category_name?: string | null
  name: string
  description?: string | null
  is_active: boolean
  images: ProductImage[]
}

export type AdminOfferDetail = {
  id: number
  initial_price: string
  discounted_price: string
  discount_percentage: string
  available_quantity: number
  starts_at: string
  ends_at: string
  expiry_date?: string | null
  status: string
  product: {
    id: number
    name: string
    description?: string | null
    category_name?: string | null
    image_url?: string | null
    images: ProductImage[]
  }
  store: {
    id: number
    name: string
    address: string
    phone?: string | null
    validation_status?: string
  }
}

export type AdminStoreDetail = {
  store: Store
  owner: UserSummary | null
  products: AdminProduct[]
  offers: Array<{
    id: number
    product_id: number
    product_name?: string | null
    status: string
    initial_price: string
    discounted_price: string
    discount_percentage: string
    available_quantity: number
    starts_at: string
    ends_at: string
  }>
}

export type AdminUserDetail = {
  user: UserSummary
  store: Store | null
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