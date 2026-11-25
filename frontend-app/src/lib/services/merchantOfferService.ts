import { apiClient } from '../api/client'
import type { ApiEnvelope, MerchantOffer } from '../api/types'

export async function listMerchantOffers() {
  const { data } = await apiClient.get<ApiEnvelope<{ offers: MerchantOffer[] }>>('/api/merchant/offers')
  return data.data.offers
}

export async function createMerchantOffer(payload: {
  product_id: number
  initial_price: string
  discounted_price: string
  available_quantity: number
  starts_at: string
  ends_at: string
  expiry_date?: string | null
}) {
  const { data } = await apiClient.post<ApiEnvelope<{ offer: MerchantOffer }>>('/api/merchant/offers', payload)
  return data.data.offer
}

export async function deactivateMerchantOffer(offerId: number) {
  const { data } = await apiClient.post<ApiEnvelope<{ offer: MerchantOffer }>>(
    `/api/merchant/offers/${offerId}/deactivate`,
  )
  return data.data.offer
}

export async function withdrawMerchantOffer(offerId: number) {
  const { data } = await apiClient.post<ApiEnvelope<{ offer: MerchantOffer }>>(
    `/api/merchant/offers/${offerId}/withdraw`,
  )
  return data.data.offer
}

export async function updateMerchantOffer(
  offerId: number,
  payload: Partial<{
    initial_price: string
    discounted_price: string
    available_quantity: number
    starts_at: string
    ends_at: string
    expiry_date: string | null
  }>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ offer: MerchantOffer }>>(
    `/api/merchant/offers/${offerId}`,
    payload,
  )
  return data.data.offer
}