import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useChangePassword } from '@/modules/account/hooks/use-change-password'
import { useAuthStore } from '@/store/auth-store'

const inputClasses = 'w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none'

export default function AccountProfilePage() {
  usePageTitle('Profile')

  const user = useAuthStore((state) => state.user)
  const { mutate, isPending, error, isSuccess, reset } = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Profile</p>
        <h1 className="mt-1 font-serif text-3xl font-normal tracking-tight text-neutral-900">
          Your details
        </h1>
      </div>

      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">
          Account
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-neutral-500">Name</dt>
            <dd className="mt-1 text-sm text-neutral-900">{user?.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-neutral-500">Email</dt>
            <dd className="mt-1 text-sm text-neutral-900">{user?.email ?? '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">
          Change password
        </h2>

        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              className="text-xs uppercase tracking-[0.3em] text-neutral-500"
              htmlFor="current-password"
            >
              Current password
            </label>
            <input
              autoComplete="current-password"
              className={inputClasses}
              id="current-password"
              onChange={(event) => {
                setCurrentPassword(event.target.value)
                reset()
              }}
              required
              type="password"
              value={currentPassword}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-xs uppercase tracking-[0.3em] text-neutral-500"
              htmlFor="new-password"
            >
              New password
            </label>
            <input
              autoComplete="new-password"
              className={inputClasses}
              id="new-password"
              minLength={8}
              onChange={(event) => {
                setNewPassword(event.target.value)
                reset()
              }}
              required
              type="password"
              value={newPassword}
            />
            <p className="text-xs text-neutral-500">
              At least 8 characters including upper, lower, number, and a special character.
            </p>
          </div>

          {error ? (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {extractErrorMessage(error, 'Unable to change password')}
            </p>
          ) : null}

          {isSuccess ? (
            <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Password updated.
            </p>
          ) : null}

          <button
            className="inline-flex items-center justify-center gap-2 self-start bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                Saving…
              </>
            ) : (
              'Update password'
            )}
          </button>
        </form>
      </section>
    </div>
  )
}
