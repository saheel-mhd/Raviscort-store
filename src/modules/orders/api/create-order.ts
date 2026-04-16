import { apiClient, type ApiEnvelope } from '@/api/client'
import type { CreateOrderInput, Order } from '@/modules/orders/types/order.types'

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await apiClient.post<ApiEnvelope<Order>>('/orders', input)
  return response.data.data
}
