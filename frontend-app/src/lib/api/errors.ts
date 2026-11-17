import type { AxiosError } from 'axios'

type ErrorBody = {
  message?: string
  errors?: unknown
}

export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue.') {
  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ErrorBody>
    return axiosError.response?.data?.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}