import type { MyOrdersParams } from '@/modules/orders/types/order.types'

export const ordersKeys = {
  all: ['orders'] as const,
  my: (params: MyOrdersParams) => ['orders', 'my', params] as const,
  detail: (id: string) => ['orders', 'detail', id] as const,
}
