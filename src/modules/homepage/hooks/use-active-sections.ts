import { useQuery } from '@tanstack/react-query'

import { activeHomepageSectionsQueryOptions } from '@/modules/homepage/api/list-active-sections'

export function useActiveHomepageSections() {
  return useQuery(activeHomepageSectionsQueryOptions)
}
