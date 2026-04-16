export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered'

export type OrderItemSnapshot = {
  productVariantId?: string
  productId: string
  name: string
  slug: string
  sku: string
  unitId?: string
  unitName?: string
  unitShortName?: string
  unitCategoryId?: string
  unitCategoryName?: string
  unitPrice?: number
  price?: number
  quantity: number
  lineTotal?: number
}

export type Order = {
  id: string
  orderNumber: string
  customerId: string
  couponId: string | null
  items: OrderItemSnapshot[]
  subtotalAmount: number
  discountAmount: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type OrdersListResponse = {
  orders: Order[]
  pagination: Pagination
}

export type CreateOrderInput = {
  items: { productVariantId: string; quantity: number }[]
}

export type MyOrdersParams = {
  page?: number
  limit?: number
  status?: OrderStatus
  sortBy?: 'createdAt' | 'updatedAt' | 'status' | 'totalAmount'
  sortOrder?: 'asc' | 'desc'
}
