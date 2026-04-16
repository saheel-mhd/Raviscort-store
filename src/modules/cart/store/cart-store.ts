import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { CartItem } from '@/modules/cart/types/cart.types'

type AddInput = Omit<CartItem, 'quantity'> & { quantity?: number }

type CartStore = {
  items: CartItem[]
  hasHydrated: boolean
  addItem: (item: AddInput) => void
  setQuantity: (productVariantId: string, quantity: number) => void
  removeItem: (productVariantId: string) => void
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
          const existing = state.items.find(
            (item) => item.productVariantId === input.productVariantId,
          )

          if (existing) {
            const nextQty = clampQuantity(existing.quantity + requested, input.maxStock)
            if (nextQty === 0) {
              return {
                items: state.items.filter(
                  (item) => item.productVariantId !== input.productVariantId,
                ),
              }
            }
            return {
              items: state.items.map((item) =>
                item.productVariantId === input.productVariantId
                  ? { ...item, quantity: nextQty, maxStock: input.maxStock, price: input.price }
                  : item,
              ),
            }
          }

          const qty = clampQuantity(requested, input.maxStock)
          if (qty === 0) return state

          return {
            items: [
              ...state.items,
              {
                productVariantId: input.productVariantId,
                productId: input.productId,
                name: input.name,
                slug: input.slug,
                sku: input.sku,
                price: input.price,
                quantity: qty,
                maxStock: input.maxStock,
                sizeName: input.sizeName,
                sizeShortName: input.sizeShortName,
                unitCategoryName: input.unitCategoryName,
                cardImage: input.cardImage,
              },
            ],
          }
        })
      },

      setQuantity: (productVariantId, quantity) => {
        set((state) => {
          const existing = state.items.find((item) => item.productVariantId === productVariantId)
          if (!existing) return state

          const nextQty = clampQuantity(quantity, existing.maxStock)
          if (nextQty === 0) {
            return {
              items: state.items.filter((item) => item.productVariantId !== productVariantId),
            }
          }

          return {
            items: state.items.map((item) =>
              item.productVariantId === productVariantId ? { ...item, quantity: nextQty } : item,
            ),
          }
        })
      },

      removeItem: (productVariantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productVariantId !== productVariantId),
        }))
      },

      clear: () => set({ items: [] }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'raviscort-cart-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
