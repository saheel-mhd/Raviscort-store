import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type { ActiveShopSectionsResponse } from '@/modules/shop-layout/types/shop-section.types'

export const shopSectionsKeys = {
  active: ['shop-sections', 'active'] as const,
}

export const activeShopSectionsQueryOptions = queryOptions({
  queryKey: shopSectionsKeys.active,
  queryFn: async (): Promise<ActiveShopSectionsResponse> => {
    const response = await apiClient.get<ApiEnvelope<ActiveShopSectionsResponse>>(
      '/shop-sections/active',
    )
    return response.data.data
  },
})
