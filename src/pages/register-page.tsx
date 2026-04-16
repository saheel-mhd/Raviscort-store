import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import { AuthForm } from '@/modules/auth/components/auth-form'
import { useRegister } from '@/modules/auth/hooks/use-register'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'

type LocationState = { from?: string } | null

export default function RegisterPage() {
  usePageTitle('Create an account')

  const location = useLocation()
  const navigate = useNavigate()
  const status = useAuthStore((state) => state.status)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const { mutate, isPending, error } = useRegister()

  const redirectTo = (location.state as LocationState)?.from ?? routePaths.home

  if (hasHydrated && status === 'authenticated') {
    return <Navigate replace to={redirectTo} />
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-8 py-12">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-xs uppercase tracking-[0.4em] text-neutral-500">Account</span>
        <h1 className="text-3xl font-semibold text-neutral-900">Create an account</h1>
        <p className="text-sm text-neutral-500">One account for checkout and order tracking.</p>
      </div>

      <AuthForm
        error={error}
        isSubmitting={isPending}
        mode="register"
        onSubmit={(values) =>
          mutate(values, {
            onSuccess: () => navigate(redirectTo, { replace: true }),
          })
        }
        submitLabel="Create account"
      />

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link
          className="text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
          state={location.state}
          to={routePaths.login}
        >
          Sign in
        </Link>
      </p>
    </section>
  )
}
