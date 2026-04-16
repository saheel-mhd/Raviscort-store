export type Product = {
  id: string
  name: string
  slug: string
  sku: string
  description: string | null
  price: number
  stock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ProductListResponse = {
  products: Product[]
  pagination: Pagination
}

export type ProductSortField = 'name' | 'price' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export type ProductListParams = {
  page?: number
  limit?: number
  search?: string
  sortBy?: ProductSortField
  sortOrder?: SortOrder
}
