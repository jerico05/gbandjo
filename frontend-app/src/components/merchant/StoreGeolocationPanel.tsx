import { useEffect, useRef } from 'react'

import { useGeolocation } from '../../lib/hooks/useGeolocation'
import { cn } from '../../lib/utils/cn'
import { Icon } from '../icons/Icon'
import { Button } from '../ui/Button'

type StoreGeolocationPanelProps = {
  latitude: string
  longitude: string
  onCoordsChange: (latitude: number, longitude: number) => void
  hasSavedCoords: boolean
  autoDetect?: boolean
  className?: string
}

function formatCoord(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(5) : '…'
}

export function StoreGeolocationPanel({
  latitude,
  longitude,
  onCoordsChange,
  hasSavedCoords,
  autoDetect = true,
  className,
}: StoreGeolocationPanelProps) {
  const { coords, error, isLoading, requestPosition } = useGeolocation()
  const autoRequested = useRef(false)

  useEffect(() => {
    if (!autoDetect || hasSavedCoords || autoRequested.current) return
    autoRequested.current = true
    requestPosition()
  }, [autoDetect, hasSavedCoords, requestPosition])

  useEffect(() => {
    if (!coords) return
    onCoordsChange(coords.latitude, coords.longitude)
  }, [coords, onCoordsChange])

  const hasCoords = Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))

  return (
    <div className={cn('rounded-2xl border border-gbandjo-border bg-gbandjo-surface/80 p-4 sm:p-5', className)}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gbandjo-green-light text-gbandjo-green">
          <Icon name="location" className="h-5 w-5" title="Localisation" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gbandjo-ink">Localisation du commerce</p>
          <p className="mt-1 text-xs text-gbandjo-muted">
            {hasSavedCoords
              ? 'Coordonnées chargées depuis votre fiche enregistrée.'
              : 'Placez-vous au point de vente : la position GPS est détectée à l’ouverture du formulaire.'}
          </p>
        </div>
      </div>

      {hasCoords ? (
        <p className="mt-3 flex items-center gap-2 rounded-xl border border-gbandjo-border bg-white px-3 py-2 font-mono text-xs text-gbandjo-ink">
          <Icon name="location" className="h-4 w-4 shrink-0 text-gbandjo-green" />
          <span>
            {formatCoord(latitude)}, {formatCoord(longitude)}
          </span>
        </p>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-xs text-gbandjo-muted">
          <Icon name="location" className="h-4 w-4 shrink-0 opacity-60" />
          {isLoading ? 'Détection de la position en cours…' : 'En attente d’une position GPS.'}
        </p>
      )}

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      <Button
        type="button"
        variant="outline"
        className="mt-4 gap-2 !px-4 !py-2 text-sm"
        disabled={isLoading}
        onClick={() => requestPosition()}
      >
        <Icon name="location" className="h-4 w-4" />
        {isLoading ? 'Localisation en cours…' : hasCoords ? 'Actualiser la position' : 'Détecter ma position'}
      </Button>
    </div>
  )
}