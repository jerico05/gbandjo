import { type FormEvent, useEffect, useState } from 'react'

import { getApiErrorMessage } from '../../lib/api/errors'
import type { MerchantOffer } from '../../lib/api/types'
import { updateMerchantOffer } from '../../lib/services/merchantOfferService'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

type OfferEditModalProps = {
  offer: MerchantOffer | null
  open: boolean
  onClose: () => void
  onSaved: () => Promise<void> | void
}

function toLocalInputValue(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toDateInputValue(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function toIsoFromLocal(value: string) {
  return new Date(value).toISOString()
}

export function OfferEditModal({ offer, open, onClose, onSaved }: OfferEditModalProps) {
  const [initialPrice, setInitialPrice] = useState('')
  const [discountedPrice, setDiscountedPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!offer || !open) return
    setInitialPrice(String(offer.initial_price))
    setDiscountedPrice(String(offer.discounted_price))
    setQuantity(String(offer.available_quantity))
    setStartsAt(toLocalInputValue(offer.starts_at))
    setEndsAt(toLocalInputValue(offer.ends_at))
    setExpiryDate(toDateInputValue(offer.expiry_date))
    setError('')
  }, [offer, open])

  if (!offer) return null

  const isLocked = offer.status === 'RETIREE'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isLocked) return
    setError('')
    setIsSaving(true)
    try {
      await updateMerchantOffer(offer.id, {
        initial_price: initialPrice,
        discounted_price: discountedPrice,
        available_quantity: Number(quantity),
        starts_at: toIsoFromLocal(startsAt),
        ends_at: toIsoFromLocal(endsAt),
        expiry_date: expiryDate || null,
      })
      await onSaved()
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Modification impossible.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modifier l’offre"
      description={
        offer.product_name
          ? `${offer.product_name} · ${offer.status}`
          : `Offre #${offer.id} · ${offer.status}`
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={isSaving} onClick={onClose}>
            Fermer
          </Button>
          {!isLocked ? (
            <Button type="submit" form="offer-edit-form" disabled={isSaving}>
              {isSaving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          ) : null}
        </div>
      }
    >
      {isLocked ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Cette offre est retirée et ne peut plus être modifiée.
        </p>
      ) : (
        <form id="offer-edit-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            label="Prix initial (FCFA)"
            value={initialPrice}
            onChange={(e) => setInitialPrice(e.target.value)}
            required
          />
          <Input
            label="Prix promotionnel (FCFA)"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            required
          />
          <Input
            label="Quantité disponible"
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <Input
            label="Date limite consommation"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <Input
            label="Début"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
          <Input
            label="Fin"
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            required
          />
          {error ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}
        </form>
      )}
    </Modal>
  )
}
