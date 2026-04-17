import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type { WishlistResponse } from '@/modules/account/types/account.types'

export const wishlistKeys = {
  all: ['wishlist'] as const,
}

export const wishlistQueryOptions = queryOptions({
  queryKey: wishlistKeys.all,
  queryFn: async (): Promise<WishlistResponse> => {
    const response = await apiClient.get<ApiEnvelope<WishlistResponse>>('/wishlist')
    return response.data.data
  },
})

export async function addToWishlist(productId: string): Promise<WishlistResponse> {
  const response = await apiClient.post<ApiEnvelope<WishlistResponse>>(`/wishlist/${productId}`)
  return response.data.data
}

export async function removeFromWishlist(productId: string): Promise<WishlistResponse> {
  const response = await apiClient.delete<ApiEnvelope<WishlistResponse>>(`/wishlist/${productId}`)
  return response.data.data
}
