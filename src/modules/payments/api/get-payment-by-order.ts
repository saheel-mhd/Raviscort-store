import { queryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { apiClient, type ApiEnvelope } from '@/api/client'
import { paymentsKeys } from '@/modules/payments/api/payments.keys'
import type { Payment } from '@/modules/payments/types/payment.types'

export function paymentByOrderQueryOptions(orderId: string) {
  return queryOptions({
    queryKey: paymentsKeys.byOrder(orderId),
    queryFn: async (): Promise<Payment | null> => {
      try {
        const response = await apiClient.get<ApiEnvelope<Payment>>(`/payments/order/${orderId}`)
        return response.data.data
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null
        }
        throw error
      }
    },
    enabled: orderId.length > 0,
  })
}
