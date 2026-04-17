import { useQuery } from '@tanstack/react-query'

import { activeShopSectionsQueryOptions } from '@/modules/shop-layout/api/list-active-shop-sections'

export function useActiveShopSections() {
  return useQuery(activeShopSectionsQueryOptions)
}
