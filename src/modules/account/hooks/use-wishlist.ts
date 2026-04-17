import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  addToWishlist,
  removeFromWishlist,
  wishlistKeys,
  wishlistQueryOptions,
} from '@/modules/account/api/wishlist'
import type { WishlistResponse } from '@/modules/account/types/account.types'
import { useAuthStore } from '@/store/auth-store'

export function useWishlist() {
  const status = useAuthStore((state) => state.status)
  return useQuery({
    ...wishlistQueryOptions,
    enabled: status === 'authenticated',
  })
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()
  return useMutation<WishlistResponse, Error, string>({
    mutationFn: addToWishlist,
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistKeys.all, data)
    },
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()
  return useMutation<WishlistResponse, Error, string>({
    mutationFn: removeFromWishlist,
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistKeys.all, data)
    },
  })
}
