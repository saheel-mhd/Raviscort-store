import { useQuery } from '@tanstack/react-query'

import { myOrdersQueryOptions } from '@/modules/orders/api/list-my-orders'
import type { MyOrdersParams } from '@/modules/orders/types/order.types'

export function useMyOrders(params: MyOrdersParams) {
  return useQuery(myOrdersQueryOptions(params))
}
