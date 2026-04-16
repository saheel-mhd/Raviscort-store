import { useMutation } from '@tanstack/react-query'

import { register } from '@/modules/auth/api/register'
import type { AuthResponse, RegisterInput } from '@/modules/auth/types/auth.types'
import { useAuthStore } from '@/store/auth-store'

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: register,
    onSuccess: ({ user, token }) => {
      setSession({ accessToken: token, user })
    },
  })
}
