import { apiClient } from '../api/client'
import type { ApiEnvelope, Category, ConsumerOffer } from '../api/types'
import { mockCategories, mockOffers } from '../../data/mock/catalog'

export type OfferListParams = {
  q?: string
  category_id?: number
  min_price?: string
  max_price?: string
  min_discount?: string
  latitude?: number
  longitude?: number
  sort?: 'distance'
}

export async function fetchOffers(
  params?: OfferListParams,
): Promise<{ offers: ConsumerOffer[]; source: 'api' | 'mock' }> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ offers: ConsumerOffer[] }>>('/api/offers', {
      params,
    })
    return { offers: data.data.offers, source: 'api' }
  } catch {
    return { offers: mockOffers, source: 'mock' }
  }
}

export async function fetchOfferById(id: number): Promise<ConsumerOffer | null> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ offer: ConsumerOffer }>>(`/api/offers/${id}`)
    return data.data.offer
  } catch {
    return mockOffers.find((o) => o.id === id) ?? null
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<{ categories: Category[] }>>('/api/categories')
    return data.data.categories
  } catch {
    return mockCategories
  }
}