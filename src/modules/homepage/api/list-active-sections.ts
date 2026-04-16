import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type { ActiveHomepageSectionsResponse } from '@/modules/homepage/types/homepage-section.types'

export const homepageSectionsKeys = {
  active: ['homepage-sections', 'active'] as const,
}

export const activeHomepageSectionsQueryOptions = queryOptions({
  queryKey: homepageSectionsKeys.active,
  queryFn: async (): Promise<ActiveHomepageSectionsResponse> => {
    const response = await apiClient.get<ApiEnvelope<ActiveHomepageSectionsResponse>>(
      '/homepage-sections/active',
    )
    return response.data.data
  },
})
