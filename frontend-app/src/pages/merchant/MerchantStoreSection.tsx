import { type FormEvent, useCallback, useEffect, useState } from 'react'

import { StoreGeolocationPanel } from '../../components/merchant/StoreGeolocationPanel'
import { Icon } from '../../components/icons/Icon'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { getApiErrorMessage } from '../../lib/api/errors'
import type { Store } from '../../lib/api/types'
import { createStore, updateStore } from '../../lib/services/storeService'
import { storeValidationLabel, storeValidationTone } from '../../lib/utils/storeStatus'
import { cn } from '../../lib/utils/cn'

type MerchantStoreSectionProps = {
  store: Store | null
  onUpdated: (store: Store) => void
  variant?: 'default' | 'dashboard'
}

function coordsFromStore(store: Store | null) {
  return {
    latitude: store?.latitude != null ? String(store.latitude) : '',
    longitude: store?.longitude != null ? String(store.longitude) : '',
  }
}

export function MerchantStoreSection({ store, onUpdated, variant = 'default' }: MerchantStoreSectionProps) {
  const [expanded, setExpanded] = useState(!store)
  const [form, setForm] = useState({
    name: store?.name ?? '',
    description: store?.description ?? '',
    activity_type: store?.activity_type ?? '',
    address: store?.address ?? '',
    phone: store?.phone ?? '',
    ...coordsFromStore(store),
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setForm({
      name: store?.name ?? '',
      description: store?.description ?? '',
      activity_type: store?.activity_type ?? '',
      address: store?.address ?? '',
      phone: store?.phone ?? '',
      ...coordsFromStore(store),
    })
  }, [store])

  const handleCoordsChange = useCallback((latitude: number, longitude: number) => {
    setForm((f) => ({
      ...f,
      latitude: String(latitude),
      longitude: String(longitude),
    }))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const lat = Number(form.latitude)
    const lon = Number(form.longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setError('Définissez la position du commerce via le GPS avant d’enregistrer.')
      return
    }
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        activity_type: form.activity_type,
        address: form.address,
        phone: form.phone || undefined,
        latitude: lat,
        longitude: lon,
      }
      const result = store ? await updateStore(payload) : await createStore(payload)
      onUpdated(result)
      setMessage(store ? 'Commerce mis à jour.' : 'Demande envoyée. En attente de validation.')
      if (store) setExpanded(false)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  const shellClass = cn(
    'overflow-hidden rounded-3xl border border-gbandjo-border bg-white shadow-sm',
    variant === 'default' && 'p-6',
  )

  const savedCoords = Boolean(store?.latitude != null && store?.longitude != null)

  return (
    <section className={shellClass}>
      <header
        className={cn(
          'flex flex-wrap items-start justify-between gap-4',
          variant === 'dashboard' ? 'border-b border-gbandjo-border px-5 py-4 sm:px-6' : '',
        )}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gbandjo-green-light text-gbandjo-green">
            <Icon name="store" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-gbandjo-ink">Fiche commerce</h2>
            {store ? (
              <>
                <p className="mt-0.5 text-sm text-gbandjo-muted">
                  {store.address}
                  {store.phone ? ` (${store.phone})` : ''}
                </p>
                {savedCoords ? (
                  <p className="mt-1 font-mono text-[11px] text-gbandjo-muted">
                    GPS : {store.latitude.toFixed(5)}, {store.longitude.toFixed(5)}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-0.5 text-sm text-gbandjo-muted">Enregistrez votre commerce pour publier des offres.</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {store ? <Badge tone={storeValidationTone(store.validation_status)}>{storeValidationLabel(store.validation_status)}</Badge> : null}
          {store ? (
            <Button type="button" variant="outline" className="!py-2 !px-4" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Fermer' : 'Modifier'}
            </Button>
          ) : (
            <Button type="button" variant="ghost" className="!py-2 !px-4" onClick={() => setExpanded(true)}>
              Commencer
            </Button>
          )}
        </div>
      </header>

      {store && !expanded && store.rejection_reason ? (
        <p className="mx-5 mb-0 mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 sm:mx-6">
          Motif : {store.rejection_reason}
        </p>
      ) : null}

      {expanded ? (
        <div className={cn(variant === 'dashboard' ? 'p-5 sm:p-6' : 'mt-6')}>
          {message ? <p className="mb-3 text-sm font-medium text-gbandjo-green">{message}</p> : null}
          {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Input label="Nom du commerce" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input
              label="Type d'activité"
              value={form.activity_type}
              onChange={(e) => setForm({ ...form, activity_type: e.target.value })}
              required
            />
            <Input
              label="Adresse"
              className="sm:col-span-2"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <Input label="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <div className="sm:col-span-2">
              <Input
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <StoreGeolocationPanel
                latitude={form.latitude}
                longitude={form.longitude}
                onCoordsChange={handleCoordsChange}
                hasSavedCoords={savedCoords}
                autoDetect={!savedCoords}
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button type="submit">{store ? 'Enregistrer les modifications' : 'Envoyer pour validation'}</Button>
              {store ? (
                <Button type="button" variant="ghost" onClick={() => setExpanded(false)}>
                  Annuler
                </Button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}