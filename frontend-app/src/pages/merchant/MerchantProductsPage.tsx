import { useQueryClient } from '@tanstack/react-query'
import { type FormEvent, Fragment, useMemo, useState } from 'react'

import { ProductCreateImageSlots, productCreateMinImages } from '../../components/merchant/ProductCreateImageSlots'
import { Icon } from '../../components/icons/Icon'
import { MerchantWorkspace } from '../../components/merchant/MerchantWorkspace'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Pagination } from '../../components/ui/Pagination'
import { Badge } from '../../components/ui/Badge'
import { getApiErrorMessage } from '../../lib/api/errors'
import type { Product } from '../../lib/api/types'
import { catalogCategoryQueryKey, useCategories } from '../../lib/hooks/useCatalog'
import { merchantKeys, useMerchantProducts } from '../../lib/hooks/useMerchant'
import { MerchantTableSkeleton } from '../../components/ui/MerchantDataSkeleton'
import {
  addProductImageUrl,
  createProduct,
  deleteProduct,
  deleteProductImage,
  updateProduct,
  uploadProductImage,
} from '../../lib/services/merchantProductService'

const PAGE_SIZE = 8

export function MerchantProductsPage() {
  const queryClient = useQueryClient()
  const productsQuery = useMerchantProducts()
  const categoriesQuery = useCategories()
  const products = productsQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const isLoadingCategories =
    categoriesQuery.isPending || (categoriesQuery.isFetching && categories.length === 0)
  const categoriesUnavailable = !isLoadingCategories && categories.length === 0
  const isLoadingProducts = productsQuery.isLoading && !productsQuery.data
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ category_id: '', name: '', description: '' })
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [imageUrl, setImageUrl] = useState<Record<number, string>>({})
  const [createImages, setCreateImages] = useState<(File | null)[]>([null, null, null])
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function refreshProducts() {
    try {
      await queryClient.invalidateQueries({ queryKey: merchantKeys.products })
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter && String(p.category_id) !== categoryFilter) return false
      if (statusFilter === 'active' && !p.is_active) return false
      if (statusFilter === 'inactive' && p.is_active) return false
      return true
    })
  }, [products, search, categoryFilter, statusFilter])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetCreateForm() {
    setForm({ category_id: '', name: '', description: '' })
    setCreateImages([null, null, null])
    setShowAdd(false)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError('')
    const files = createImages.filter((f): f is File => f != null)
    if (files.length < productCreateMinImages) {
      setError(`Ajoutez au moins ${productCreateMinImages} images avant de publier le produit.`)
      return
    }
    setIsCreating(true)
    try {
      const product = await createProduct({
        category_id: Number(form.category_id),
        name: form.name,
        description: form.description || undefined,
      })
      for (let i = 0; i < createImages.length; i++) {
        const file = createImages[i]
        if (file) await uploadProductImage(product.id, file, i)
      }
      resetCreateForm()
      setMessage('Produit créé avec ses images.')
      await refreshProducts()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsCreating(false)
    }
  }

  async function handleToggleActive(product: Product) {
    await updateProduct(product.id, { is_active: !product.is_active })
    await refreshProducts()
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce produit ?')) return
    await deleteProduct(id)
    await refreshProducts()
  }

  async function handleUpload(productId: number, file: File) {
    await uploadProductImage(productId, file)
    setMessage('Image envoyée.')
    await refreshProducts()
  }

  return (
    <MerchantWorkspace>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gbandjo-green-light text-gbandjo-green">
            <Icon name="products" className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-gbandjo-ink">Produits</span>
        </div>
        <Button type="button" onClick={() => setShowAdd((v) => !v)}>
          + Ajouter un produit
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-2xl border border-gbandjo-border bg-gbandjo-surface px-3 py-2">
          <Icon name="search" className="h-4 w-4 text-gbandjo-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Rechercher un produit…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          disabled={isLoadingCategories}
          className="rounded-xl border border-gbandjo-border px-3 py-2 text-sm disabled:opacity-60"
        >
          <option value="">{isLoadingCategories ? 'Catégories…' : 'Catégorie : toutes'}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gbandjo-border px-3 py-2 text-sm"
        >
          <option value="">Statut : tous</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
        <span className="inline-flex items-center gap-2 rounded-xl border border-gbandjo-border px-3 py-2 text-sm text-gbandjo-muted">
          <Icon name="filter" className="h-4 w-4" />
          Filtres
        </span>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {message ? <p className="mb-4 text-sm text-gbandjo-green">{message}</p> : null}

      {showAdd ? (
        <form
          className="mb-6 grid gap-4 rounded-2xl border border-gbandjo-border bg-gbandjo-surface p-5 sm:grid-cols-2"
          onSubmit={handleCreate}
        >
          <label className="text-sm font-medium">
            Catégorie
            <select
              className="mt-1 w-full rounded-xl border border-gbandjo-border bg-white px-3 py-2.5 text-sm disabled:opacity-60"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              required
              disabled={isLoadingCategories || categoriesUnavailable}
            >
              <option value="">
                {isLoadingCategories
                  ? 'Chargement des catégories…'
                  : categoriesUnavailable
                    ? 'Aucune catégorie disponible'
                    : 'Choisir…'}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categoriesUnavailable ? (
              <span className="mt-2 block text-xs text-gbandjo-muted">
                Le catalogue est vide côté serveur. Demandez à un administrateur d&apos;ajouter des catégories, ou
                exécutez{' '}
                <code className="rounded bg-white px-1 py-0.5 text-[0.7rem]">python scripts/seed_categories.py</code>{' '}
                sur le backend.
                <button
                  type="button"
                  className="ml-2 font-semibold text-gbandjo-green underline"
                  onClick={() => void queryClient.invalidateQueries({ queryKey: catalogCategoryQueryKey })}
                >
                  Réessayer
                </button>
              </span>
            ) : null}
          </label>
          <Input label="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input
            label="Description"
            className="sm:col-span-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <ProductCreateImageSlots files={createImages} onChange={setCreateImages} disabled={isCreating} />
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={isCreating || categoriesUnavailable || isLoadingCategories}>
              {isCreating ? 'Publication…' : 'Publier au catalogue'}
            </Button>
            <Button type="button" variant="outline" disabled={isCreating} onClick={() => resetCreateForm()}>
              Annuler
            </Button>
          </div>
        </form>
      ) : null}

      {isLoadingProducts ? (
        <MerchantTableSkeleton rows={6} />
      ) : (
      <div className="overflow-x-auto rounded-2xl border border-gbandjo-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-gbandjo-surface text-xs font-semibold uppercase tracking-wide text-gbandjo-muted">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Images</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <Fragment key={p.id}>
                <tr className="border-t border-gbandjo-border hover:bg-gbandjo-surface/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0].url} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gbandjo-green-light">
                          <Icon name="image" className="h-6 w-6 text-gbandjo-green/50" />
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-gbandjo-ink">{p.name}</p>
                        <p className="text-xs text-gbandjo-muted">ID #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gbandjo-muted">{p.category_name}</td>
                  <td className="px-4 py-4">{p.images?.length ?? 0}</td>
                  <td className="px-4 py-4">
                    <Badge tone={p.is_active ? 'green' : 'neutral'}>{p.is_active ? 'Actif' : 'Inactif'}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-gbandjo-green px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <Icon name="edit" className="h-4 w-4" />
                        Modifier
                      </button>
                      <button type="button" onClick={() => void handleDelete(p.id)} aria-label="Supprimer">
                        <Icon name="trash" className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === p.id ? (
                  <tr className="border-t border-gbandjo-border bg-gbandjo-surface/40">
                    <td colSpan={5} className="px-4 py-4">
                      <p className="mb-2 text-sm text-gbandjo-muted">{p.description || 'Aucune description'}</p>
                      <div className="flex flex-wrap items-end gap-2">
                        <Button type="button" variant="outline" onClick={() => void handleToggleActive(p)}>
                          {p.is_active ? 'Désactiver' : 'Activer'}
                        </Button>
                        <label className="cursor-pointer rounded-xl border border-gbandjo-border px-3 py-2 text-xs">
                          Upload image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) void handleUpload(p.id, file)
                            }}
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="URL image"
                          className="rounded-xl border border-gbandjo-border px-3 py-2 text-sm"
                          value={imageUrl[p.id] ?? ''}
                          onChange={(e) => setImageUrl({ ...imageUrl, [p.id]: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="!px-3 !py-2 text-xs"
                          onClick={() =>
                            void addProductImageUrl(p.id, imageUrl[p.id] ?? '')
                              .then(refreshProducts)
                              .catch((err) => setError(getApiErrorMessage(err)))
                          }
                        >
                          Ajouter URL
                        </Button>
                      </div>
                      {p.images?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.images.map((img) => (
                            <span key={img.id} className="relative">
                              <img src={img.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                              <button
                                type="button"
                                className="absolute -right-1 -top-1 rounded-full bg-white text-xs text-red-600 shadow"
                                onClick={() => void deleteProductImage(p.id, img.id).then(refreshProducts)}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      )}

      <Pagination
        page={page}
        pages={pages}
        hasPrev={page > 1}
        hasNext={page < pages}
        onPageChange={setPage}
        className="mt-6"
      />
    </MerchantWorkspace>
  )
}