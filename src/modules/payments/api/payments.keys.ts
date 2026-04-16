export const paymentsKeys = {
  all: ['payments'] as const,
  byOrder: (orderId: string) => ['payments', 'by-order', orderId] as const,
}
