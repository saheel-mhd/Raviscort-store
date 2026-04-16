import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createOrder } from '@/modules/orders/api/create-order'
import { ordersKeys } from '@/modules/orders/api/orders.keys'
import type { CreateOrderInput, Order } from '@/modules/orders/types/order.types'

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation<Order, Error, CreateOrderInput>({
    mutationFn: createOrder,
    onSuccess: (order) => {
      queryClient.setQueryData(ordersKeys.detail(order.id), order)
      void queryClient.invalidateQueries({ queryKey: ordersKeys.all })
    },
  })
}
