import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { CartItem } from '@/modules/cart/types/cart.types'

type AddInput = Omit<CartItem, 'quantity'> & { quantity?: number }

type CartStore = {
  items: CartItem[]
  hasHydrated: boolean
  addItem: (item: AddInput) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  setHasHydrated: (value: boolean) => void
}

function clampQuantity(quantity: number, max: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) return 0
  if (max <= 0) return 0
  return Math.min(Math.floor(quantity), max)
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,

      addItem: (input) => {
        set((state) => {
          const requested = input.quantity ?? 1
          const existing = state.items.find((item) => item.productId === input.productId)

          if (existing) {
            const nextQty = clampQuantity(existing.quantity + requested, input.maxStock)
            if (nextQty === 0) {
              return {
                items: state.items.filter((item) => item.productId !== input.productId),
              }
            }
            return {
              items: state.items.map((item) =>
                item.productId === input.productId
                  ? { ...item, quantity: nextQty, maxStock: input.maxStock, price: input.price }
                  : item
              ),
            }
          }

          const qty = clampQuantity(requested, input.maxStock)
          if (qty === 0) return state

          return {
            items: [
              ...state.items,
              {
                productId: input.productId,
                name: input.name,
                slug: input.slug,
                sku: input.sku,
                price: input.price,
                quantity: qty,
                maxStock: input.maxStock,
              },
            ],
          }
        })
      },

      setQuantity: (productId, quantity) => {
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId)
          if (!existing) return state

          const nextQty = clampQuantity(quantity, existing.maxStock)
          if (nextQty === 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            }
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity: nextQty } : item
            ),
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      clear: () => set({ items: [] }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'raviscort-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
