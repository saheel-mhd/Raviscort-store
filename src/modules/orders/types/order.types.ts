export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

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

export type ShippingAddressSnapshot = {
  addressId: string
  label: string | null
  fullName: string
  phone: string | null
  line1: string
  line2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
}

export type Order = {
  id: string
  orderNumber: string
  customerId: string
  couponId: string | null
  addressId: string | null
  shippingAddress: ShippingAddressSnapshot | null
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
  addressId: string
  couponCode?: string
  items: { productVariantId: string; quantity: number }[]
}

export type MyOrdersParams = {
  page?: number
  limit?: number
  status?: OrderStatus
  sortBy?: 'createdAt' | 'updatedAt' | 'status' | 'totalAmount'
  sortOrder?: 'asc' | 'desc'
}
