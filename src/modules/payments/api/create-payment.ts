import { apiClient, type ApiEnvelope } from '@/api/client'
import type { CreatePaymentInput, Payment } from '@/modules/payments/types/payment.types'

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const response = await apiClient.post<ApiEnvelope<Payment>>('/payments', input)
  return response.data.data
}
