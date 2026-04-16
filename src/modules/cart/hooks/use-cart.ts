import { useMemo } from 'react'

import { useCartStore } from '@/modules/cart/store/cart-store'

export function useCartItems() {
  return useCartStore((state) => state.items)
}

export function useCartItemCount() {
  const items = useCartItems()
  return useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
}

export function useCartSubtotal() {
  const items = useCartItems()
  return useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  )
}

export function useCartActions() {
  const addItem = useCartStore((state) => state.addItem)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clear = useCartStore((state) => state.clear)
  return { addItem, setQuantity, removeItem, clear }
}
