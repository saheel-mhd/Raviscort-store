import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'

type Props = {
  mode: 'login' | 'register'
  isSubmitting: boolean
  error: unknown
  onSubmit: (values: { email: string; password: string }) => void
  submitLabel: string
}

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function AuthForm({ mode, isSubmitting, error, onSubmit, submitLabel }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ email: email.trim(), password })
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="auth-email">
          Email
        </label>
        <input
          autoComplete="email"
          className={inputClasses}
          id="auth-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400" htmlFor="auth-password">
          Password
        </label>
        <input
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className={inputClasses}
          id="auth-password"
          minLength={mode === 'register' ? 8 : 1}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          type="password"
          value={password}
        />
        {mode === 'register' ? (
          <p className="text-xs text-slate-500">
            At least 8 characters including upper, lower, number, and a special character.
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {extractErrorMessage(error, mode === 'login' ? 'Unable to sign in' : 'Unable to create account')}
        </p>
      ) : null}

      <button
        className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Working…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  )
}
