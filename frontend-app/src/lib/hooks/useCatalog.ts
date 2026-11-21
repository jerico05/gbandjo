import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ConsumerOffer } from '../api/types'
import { fetchCategories, fetchOffers, type OfferListParams } from '../services/catalogService'

export const catalogCategoryQueryKey = ['catalog', 'categories'] as const

export function useCategories() {
  return useQuery({
    queryKey: catalogCategoryQueryKey,
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  })
}

export type OffersQueryResult = {
  offers: ConsumerOffer[]
  source: 'api' | 'mock'
  pagination?: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export function useOffers(params?: OfferListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['catalog', 'offers', params ?? {}],
    queryFn: () => fetchOffers(params),
    placeholderData: keepPreviousData,
    staleTime: 45_000,
    enabled: options?.enabled ?? true,
  })
}

/** Aperçu landing : peu d’offres, réponse plus légère. */
export function useFeaturedOffers(limit = 8) {
  return useOffers({ per_page: limit, page: 1 })
}