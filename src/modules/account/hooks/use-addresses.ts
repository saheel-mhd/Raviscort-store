import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  addressKeys,
  addressListQueryOptions,
  createAddress,
  deleteAddress,
  updateAddress,
} from '@/modules/account/api/addresses'
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from '@/modules/account/types/account.types'

export function useAddresses() {
  return useQuery(addressListQueryOptions)
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  return useMutation<Address, Error, CreateAddressInput>({
    mutationFn: createAddress,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  return useMutation<Address, Error, { id: string; input: UpdateAddressInput }>({
    mutationFn: ({ id, input }) => updateAddress(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  return useMutation<Address, Error, string>({
    mutationFn: deleteAddress,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKeys.all })
    },
  })
}
