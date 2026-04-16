import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { AppLoader } from '@/components/app-loader'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'

type Props = {
  children: ReactNode
}

export function RequireAuth({ children }: Props) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const status = useAuthStore((state) => state.status)
  const location = useLocation()

  if (!hasHydrated) {
    return <AppLoader />
  }

  if (status !== 'authenticated') {
    return <Navigate replace state={{ from: location.pathname + location.search }} to={routePaths.login} />
  }

  return <>{children}</>
}
