import type { Product } from '@/modules/products/types/product.types'

export type Address = {
  id: string
  customerId: string
  label: string | null
  fullName: string
  phone: string | null
  line1: string
  line2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type AddressListResponse = {
  addresses: Address[]
}

export type CreateAddressInput = {
  label?: string
  fullName: string
  phone?: string
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export type UpdateAddressInput = Partial<CreateAddressInput>

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type Complaint = {
  id: string
  customerId: string
  subject: string
  message: string
  adminReply: string | null
  repliedById: string | null
  repliedAt: string | null
  status: ComplaintStatus
  createdAt: string
  updatedAt: string
}

export type ComplaintsListResponse = {
  complaints: Complaint[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type CreateComplaintInput = {
  subject: string
  message: string
}

export type WishlistResponse = {
  productIds: string[]
  products: Product[]
}

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
}
