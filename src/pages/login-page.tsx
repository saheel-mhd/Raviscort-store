import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import { AuthForm } from '@/modules/auth/components/auth-form'
import { useLogin } from '@/modules/auth/hooks/use-login'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'

type LocationState = { from?: string } | null

export default function LoginPage() {
  usePageTitle('Sign in')

  const location = useLocation()
  const navigate = useNavigate()
  const status = useAuthStore((state) => state.status)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const { mutate, isPending, error } = useLogin()

  const redirectTo = (location.state as LocationState)?.from ?? routePaths.home

  if (hasHydrated && status === 'authenticated') {
    return <Navigate replace to={redirectTo} />
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-8 py-12">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-xs uppercase tracking-[0.4em] text-neutral-500">Account</span>
        <h1 className="text-3xl font-semibold text-neutral-900">Sign in</h1>
        <p className="text-sm text-neutral-500">Welcome back — let’s get you to checkout.</p>
      </div>

      <AuthForm
        error={error}
        isSubmitting={isPending}
        mode="login"
        onSubmit={(values) =>
          mutate(values, {
            onSuccess: () => navigate(redirectTo, { replace: true }),
          })
        }
        submitLabel="Sign in"
      />

      <p className="text-center text-sm text-neutral-500">
        New here?{' '}
        <Link
          className="text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
          state={location.state}
          to={routePaths.register}
        >
          Create an account
        </Link>
      </p>
    </section>
  )
}
