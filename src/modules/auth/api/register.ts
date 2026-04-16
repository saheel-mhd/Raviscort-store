import { apiClient, type ApiEnvelope } from '@/api/client'
import type { AuthResponse, RegisterInput } from '@/modules/auth/types/auth.types'

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await apiClient.post<ApiEnvelope<AuthResponse>>('/auth/register', input)
  return response.data.data
}
