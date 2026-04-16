import { apiClient, type ApiEnvelope } from '@/api/client'
import type { AuthResponse, LoginInput } from '@/modules/auth/types/auth.types'

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await apiClient.post<ApiEnvelope<AuthResponse>>('/auth/login', input)
  return response.data.data
}
