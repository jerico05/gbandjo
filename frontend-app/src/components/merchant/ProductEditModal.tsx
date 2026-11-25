import { type FormEvent, useEffect, useState } from 'react'

import { getApiErrorMessage } from '../../lib/api/errors'
import type { Category, Product } from '../../lib/api/types'
import {
  addProductImageUrl,
  deleteProductImage,
  updateProduct,
  uploadProductImage,
} from '../../lib/services/merchantProductService'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Icon } from '../icons/Icon'

type ProductEditModalProps = {
  product: Product | null
  categories: Category[]
  open: boolean
  onClose: () => void
  onSaved: () => Promise<void> | void
}

export function ProductEditModal({ product, categories, open, onClose, onSaved }: ProductEditModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [localImages, setLocalImages] = useState(product?.images ?? [])

  useEffect(() => {
    if (!product || !open) return
    setName(product.name)
    setDescription(product.description ?? '')
    setCategoryId(String(product.category_id))
    setIsActive(product.is_active)
    setImageUrl('')
    setLocalImages(product.images ?? [])
    setError('')
  }, [product, open])

  if (!product) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      await updateProduct(product.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        category_id: Number(categoryId),
        is_active: isActive,
      })
      await onSaved()
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Modification impossible.'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpload(file: File) {
    setError('')
    try {
      const updated = await uploadProductImage(product.id, file)
      setLocalImages(updated.images ?? [])
      await onSaved()
    } catch (err) {
      setError(getApiErrorMessage(err, "Envoi de l'image impossible."))
    }
  }

  async function handleAddUrl() {
    if (!imageUrl.trim()) return
    setError('')
    try {
      const updated = await addProductImageUrl(product.id, imageUrl.trim())
      setLocalImages(updated.images ?? [])
      setImageUrl('')
      await onSaved()
    } catch (err) {
      setError(getApiErrorMessage(err, "Ajout de l'URL impossible."))
    }
  }

  async function handleDeleteImage(imageId: number) {
    setError('')
    try {
      const updated = await deleteProductImage(product.id, imageId)
      setLocalImages(updated.images ?? [])
      await onSaved()
    } catch (err) {
      setError(getApiErrorMessage(err, "Suppression de l'image impossible."))
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modifier le produit"
      description="Mettez à jour les infos catalogue rapidement."
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={isSaving} onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="product-edit-form" disabled={isSaving}>
            {isSaving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      }
    >
      <form id="product-edit-form" className="grid gap-4" onSubmit={handleSubmit}>
        <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
        <label className="block text-sm font-medium text-gbandjo-ink">
          Catégorie
          <select
            className="mt-1 w-full rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gbandjo-green"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Choisir…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gbandjo-ink">
          Description
          <textarea
            className="mt-1 min-h-[96px] w-full rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gbandjo-green"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gbandjo-ink">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-gbandjo-border text-gbandjo-green focus:ring-gbandjo-green"
          />
          Produit actif (visible pour les offres)
        </label>

        <div className="rounded-xl border border-gbandjo-border bg-gbandjo-surface/50 p-3">
          <p className="mb-2 text-sm font-semibold text-gbandjo-ink">Images</p>
          {localImages.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {localImages.map((img) => (
                <span key={img.id} className="relative">
                  <img src={img.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <button
                    type="button"
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-red-600 shadow"
                    onClick={() => void handleDeleteImage(img.id)}
                    aria-label="Supprimer l'image"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="mb-3 text-xs text-gbandjo-muted">Aucune image pour l’instant.</p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-gbandjo-border bg-white px-3 py-2 text-xs font-semibold">
              <Icon name="image" className="h-4 w-4" />
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleUpload(file)
                  e.target.value = ''
                }}
              />
            </label>
            <input
              type="url"
              placeholder="URL image"
              className="w-full flex-1 rounded-xl border border-gbandjo-border px-3 py-2 text-sm"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button type="button" variant="secondary" className="!px-3 !py-2 text-xs" onClick={() => void handleAddUrl()}>
              Ajouter URL
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </Modal>
  )
}
