import { queryOptions } from '@tanstack/react-query'

import { apiClient, type ApiEnvelope } from '@/api/client'
import type {
  Address,
  AddressListResponse,
  CreateAddressInput,
  UpdateAddressInput,
} from '@/modules/account/types/account.types'

export const addressKeys = {
  all: ['addresses'] as const,
  list: ['addresses', 'list'] as const,
}

export const addressListQueryOptions = queryOptions({
  queryKey: addressKeys.list,
  queryFn: async (): Promise<AddressListResponse> => {
    const response = await apiClient.get<ApiEnvelope<AddressListResponse>>('/addresses')
    return response.data.data
  },
})

export async function createAddress(input: CreateAddressInput): Promise<Address> {
  const response = await apiClient.post<ApiEnvelope<Address>>('/addresses', input)
  return response.data.data
}

export async function updateAddress(id: string, input: UpdateAddressInput): Promise<Address> {
  const response = await apiClient.put<ApiEnvelope<Address>>(`/addresses/${id}`, input)
  return response.data.data
}

export async function deleteAddress(id: string): Promise<Address> {
  const response = await apiClient.delete<ApiEnvelope<Address>>(`/addresses/${id}`)
  return response.data.data
}
