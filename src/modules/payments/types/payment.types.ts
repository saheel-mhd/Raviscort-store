export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type Payment = {
  id: string
  orderId: string
  amount: number
  provider: string | null
  reference: string | null
  status: PaymentStatus
  createdAt: string
  updatedAt: string
}

export type CreatePaymentInput = {
  orderId: string
  provider?: string
  reference?: string
}
