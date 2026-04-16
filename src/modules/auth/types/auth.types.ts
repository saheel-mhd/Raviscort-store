import type { AuthUser } from '@/types/auth'

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}
