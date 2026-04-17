import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  Complaint,
  ComplaintsListResponse,
  CreateComplaintInput,
} from '@/modules/account/types/account.types'

export const complaintKeys = {
  all: ['complaints'] as const,
  list: (page: number) => ['complaints', 'list', page] as const,
  detail: (id: string) => ['complaints', 'detail', id] as const,
}

export function myComplaintsQueryOptions(page: number) {
  return queryOptions({
    queryKey: complaintKeys.list(page),
    queryFn: async (): Promise<ComplaintsListResponse> => {
      const response = await apiClient.get<ApiEnvelope<ComplaintsListResponse>>(
        '/complaints/my-complaints',
        { params: { page, limit: 20 } },
      )
      return response.data.data
    },
  })
}

export function complaintQueryOptions(id: string) {
  return queryOptions({
    queryKey: complaintKeys.detail(id),
    queryFn: async (): Promise<Complaint> => {
      const response = await apiClient.get<ApiEnvelope<Complaint>>(`/complaints/${id}`)
      return response.data.data
    },
    enabled: id.length > 0,
  })
}

export async function createComplaint(input: CreateComplaintInput): Promise<Complaint> {
  const response = await apiClient.post<ApiEnvelope<Complaint>>('/complaints', input)
  return response.data.data
}
