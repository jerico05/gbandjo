import { useQuery } from '@tanstack/react-query'

import { listMerchantOffers } from '../services/merchantOfferService'
import { listProducts } from '../services/merchantProductService'
import { listMerchantReservations } from '../services/reservationService'
import { fetchMyStore } from '../services/storeService'

export const merchantKeys = {
  store: ['merchant', 'store'] as const,
  products: ['merchant', 'products'] as const,
  offers: ['merchant', 'offers'] as const,
  reservations: ['merchant', 'reservations'] as const,
}

export function useMerchantStore() {
  return useQuery({
    queryKey: merchantKeys.store,
    queryFn: fetchMyStore,
    staleTime: 2 * 60_000,
    gcTime: 15 * 60_000,
    retry: false,
  })
}

export function useMerchantProducts() {
  return useQuery({
    queryKey: merchantKeys.products,
    queryFn: listProducts,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  })
}

export function useMerchantOffers() {
  return useQuery({
    queryKey: merchantKeys.offers,
    queryFn: listMerchantOffers,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  })
}

export function useMerchantReservations() {
  return useQuery({
    queryKey: merchantKeys.reservations,
    queryFn: listMerchantReservations,
    staleTime: 45_000,
    gcTime: 10 * 60_000,
  })
}