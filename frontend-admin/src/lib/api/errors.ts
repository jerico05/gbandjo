import type { AxiosError } from 'axios'

export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue.') {
  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ message?: string }>
    return axiosError.response?.data?.message ?? fallback
  }
  return fallback
}