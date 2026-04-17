import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  complaintKeys,
  complaintQueryOptions,
  createComplaint,
  myComplaintsQueryOptions,
} from '@/modules/account/api/complaints'
import type {
  Complaint,
  CreateComplaintInput,
} from '@/modules/account/types/account.types'

export function useMyComplaints(page: number) {
  return useQuery(myComplaintsQueryOptions(page))
}

export function useComplaint(id: string) {
  return useQuery(complaintQueryOptions(id))
}

export function useCreateComplaint() {
  const queryClient = useQueryClient()
  return useMutation<Complaint, Error, CreateComplaintInput>({
    mutationFn: createComplaint,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: complaintKeys.all })
    },
  })
}
