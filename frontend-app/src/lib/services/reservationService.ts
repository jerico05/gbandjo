import { apiClient } from '../api/client'
import type { ApiEnvelope, Reservation, ReservationDetail } from '../api/types'

export async function getConsumerReservation(reservationId: number) {
  const { data } = await apiClient.get<ApiEnvelope<{ reservation: ReservationDetail }>>(
    `/api/consumer/reservations/${reservationId}`,
  )
  return data.data.reservation
}

export async function listConsumerReservations() {
  const { data } = await apiClient.get<ApiEnvelope<{ reservations: Reservation[] }>>(
    '/api/consumer/reservations',
  )
  return data.data.reservations
}

export async function createReservation(offerId: number, quantity: number) {
  const { data } = await apiClient.post<ApiEnvelope<{ reservation: Reservation }>>(
    '/api/consumer/reservations',
    { offer_id: offerId, quantity },
  )
  return data.data.reservation
}

export async function cancelConsumerReservation(reservationId: number) {
  const { data } = await apiClient.post<ApiEnvelope<{ reservation: Reservation }>>(
    `/api/consumer/reservations/${reservationId}/cancel`,
  )
  return data.data.reservation
}

export async function updateConsumerReservation(reservationId: number, quantity: number) {
  const { data } = await apiClient.patch<ApiEnvelope<{ reservation: ReservationDetail }>>(
    `/api/consumer/reservations/${reservationId}`,
    { quantity },
  )
  return data.data.reservation
}

export async function listMerchantReservations() {
  const { data } = await apiClient.get<ApiEnvelope<{ reservations: Reservation[] }>>(
    '/api/merchant/reservations',
  )
  return data.data.reservations
}

export async function confirmMerchantReservation(reservationId: number) {
  const { data } = await apiClient.post<ApiEnvelope<{ reservation: Reservation }>>(
    `/api/merchant/reservations/${reservationId}/confirm`,
  )
  return data.data.reservation
}

export async function rejectMerchantReservation(reservationId: number, reason?: string) {
  const { data } = await apiClient.post<ApiEnvelope<{ reservation: Reservation }>>(
    `/api/merchant/reservations/${reservationId}/reject`,
    { reason },
  )
  return data.data.reservation
}

export async function markReservationPickedUp(reservationId: number) {
  const { data } = await apiClient.post<ApiEnvelope<{ reservation: Reservation }>>(
    `/api/merchant/reservations/${reservationId}/picked-up`,
  )
  return data.data.reservation
}

export async function cancelMerchantReservation(reservationId: number, reason?: string) {
  const { data } = await apiClient.post<ApiEnvelope<{ reservation: Reservation }>>(
    `/api/merchant/reservations/${reservationId}/cancel`,
    { reason },
  )
  return data.data.reservation
}