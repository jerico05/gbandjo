import { apiClient } from '../api/client'
import type { ApiEnvelope, Product } from '../api/types'

export async function listProducts() {
  const { data } = await apiClient.get<ApiEnvelope<{ products: Product[] }>>('/api/merchant/products')
  return data.data.products
}

export async function createProduct(payload: {
  category_id: number
  name: string
  description?: string
  is_active?: boolean
}) {
  const { data } = await apiClient.post<ApiEnvelope<{ product: Product }>>('/api/merchant/products', payload)
  return data.data.product
}

export async function updateProduct(
  productId: number,
  payload: Partial<{ category_id: number; name: string; description: string; is_active: boolean }>,
) {
  const { data } = await apiClient.patch<ApiEnvelope<{ product: Product }>>(
    `/api/merchant/products/${productId}`,
    payload,
  )
  return data.data.product
}

export async function deleteProduct(productId: number) {
  await apiClient.delete(`/api/merchant/products/${productId}`)
}

export async function addProductImageUrl(productId: number, url: string, sort_order = 0) {
  const { data } = await apiClient.post<ApiEnvelope<{ product: Product }>>(
    `/api/merchant/products/${productId}/images`,
    { url, sort_order },
  )
  return data.data.product
}

export async function uploadProductImage(productId: number, file: File, sort_order = 0) {
  const form = new FormData()
  form.append('image', file)
  form.append('sort_order', String(sort_order))
  const { data } = await apiClient.post<ApiEnvelope<{ product: Product }>>(
    `/api/merchant/products/${productId}/images/upload`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.data.product
}

export async function deleteProductImage(productId: number, imageId: number) {
  const { data } = await apiClient.delete<ApiEnvelope<{ product: Product }>>(
    `/api/merchant/products/${productId}/images/${imageId}`,
  )
  return data.data.product
}