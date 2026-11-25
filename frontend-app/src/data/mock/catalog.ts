import type { Category, ConsumerOffer } from '../../lib/api/types'

export const mockCategories: Category[] = [
  { id: 1, name: 'Produits laitiers' },
  { id: 2, name: 'Boissons et jus' },
  { id: 3, name: 'Fruits et légumes' },
  { id: 4, name: 'Boulangerie et pâtisserie' },
  { id: 5, name: 'Viandes et volailles' },
  { id: 6, name: 'Poissons et fruits de mer' },
  { id: 7, name: 'Épicerie et produits alimentaires' },
  { id: 8, name: 'Biscuits et confiseries' },
]

export const mockOffers: ConsumerOffer[] = [
  {
    id: 101,
    initial_price: '18.00',
    discounted_price: '6.50',
    discount_percentage: '64',
    available_quantity: 4,
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 86_400_000).toISOString(),
    status: 'ACTIVE',
    product: { name: 'Panier surprise boulangerie', category_name: 'Boulangerie et pâtisserie' },
    store: { name: 'Chez Ama', city: 'Lomé' },
  },
  {
    id: 102,
    initial_price: '32.00',
    discounted_price: '12.00',
    discount_percentage: '62',
    available_quantity: 2,
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 172_800_000).toISOString(),
    status: 'ACTIVE',
    product: { name: 'Invendus du jour', category_name: 'Épicerie et produits alimentaires' },
    store: { name: 'Mama Kitchen', city: 'Lomé' },
  },
  {
    id: 103,
    initial_price: '24.00',
    discounted_price: '9.90',
    discount_percentage: '59',
    available_quantity: 6,
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 259_200_000).toISOString(),
    status: 'ACTIVE',
    product: { name: 'Colis anti gaspi fruits', category_name: 'Fruits et légumes' },
    store: { name: 'Marché Vert', city: 'Kara' },
  },
]
