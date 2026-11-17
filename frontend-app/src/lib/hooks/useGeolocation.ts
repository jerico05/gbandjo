import { useCallback, useEffect, useState } from 'react'

export type GeoCoords = { latitude: number; longitude: number }

type UseGeolocationOptions = {
  /** Demande la position dès le montage du composant */
  requestOnMount?: boolean
}

export function requestCurrentPosition(): Promise<GeoCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n’est pas disponible sur cet appareil.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      () => {
        reject(new Error('Autorisez l’accès à votre position.'))
      },
      { enableHighAccuracy: true, timeout: 15000 },
    )
  })
}

export function useGeolocation(options?: UseGeolocationOptions) {
  const [coords, setCoords] = useState<GeoCoords | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n’est pas disponible sur cet appareil.')
      return
    }
    setIsLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        setIsLoading(false)
      },
      () => {
        setError('Autorisez l’accès à votre position.')
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 15000 },
    )
  }, [])

  useEffect(() => {
    if (options?.requestOnMount) requestPosition()
  }, [options?.requestOnMount, requestPosition])

  return { coords, error, isLoading, requestPosition, clear: () => setCoords(null) }
}