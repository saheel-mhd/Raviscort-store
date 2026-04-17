import type { AuthUser } from '@/types/auth'

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  phone?: string
  email: string
  password: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}
