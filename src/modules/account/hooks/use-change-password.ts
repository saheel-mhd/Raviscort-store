import { useMutation } from '@tanstack/react-query'

import { changePassword } from '@/modules/account/api/profile'
import type { ChangePasswordInput } from '@/modules/account/types/account.types'
import type { AuthUser } from '@/types/auth'

export function useChangePassword() {
  return useMutation<AuthUser, Error, ChangePasswordInput>({
    mutationFn: changePassword,
  })
}
