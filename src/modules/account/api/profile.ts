import { apiClient, type ApiEnvelope } from '@/api/client'
import type { ChangePasswordInput } from '@/modules/account/types/account.types'
import type { AuthUser } from '@/types/auth'

export async function changePassword(input: ChangePasswordInput): Promise<AuthUser> {
  const response = await apiClient.put<ApiEnvelope<AuthUser>>('/auth/me/password', input)
  return response.data.data
}
