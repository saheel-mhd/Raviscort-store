import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import { ordersKeys } from '@/modules/orders/api/orders.keys'
import type { MyOrdersParams, OrdersListResponse } from '@/modules/orders/types/order.types'

export function myOrdersQueryOptions(params: MyOrdersParams) {
  return queryOptions({
    queryKey: ordersKeys.my(params),
    queryFn: async (): Promise<OrdersListResponse> => {
      const response = await apiClient.get<ApiEnvelope<OrdersListResponse>>('/orders/my-orders', {
        params,
      })
      return response.data.data
    },
  })
}
