import { useEffect, useState, type FormEvent } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'

import { extractErrorMessage } from '@/api/client'

type LoginValues = { email: string; password: string }
type RegisterValues = { name: string; phone?: string; email: string; password: string }

type Props =
  | {
      mode: 'login'
      isSubmitting: boolean
      error: unknown
      onSubmit: (values: LoginValues) => void
      submitLabel: string
    }
  | {
      mode: 'register'
      isSubmitting: boolean
      error: unknown
      onSubmit: (values: RegisterValues) => void
      submitLabel: string
    }

const inputClasses =
  'w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none'

const countryCodes = [
  { code: '+1', flag: '🇺🇸', label: 'US' },
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+91', flag: '🇮🇳', label: 'IN' },
  { code: '+971', flag: '🇦🇪', label: 'AE' },
  { code: '+966', flag: '🇸🇦', label: 'SA' },
  { code: '+61', flag: '🇦🇺', label: 'AU' },
  { code: '+81', flag: '🇯🇵', label: 'JP' },
  { code: '+49', flag: '🇩🇪', label: 'DE' },
  { code: '+33', flag: '🇫🇷', label: 'FR' },
  { code: '+86', flag: '🇨🇳', label: 'CN' },
  { code: '+55', flag: '🇧🇷', label: 'BR' },
  { code: '+234', flag: '🇳🇬', label: 'NG' },
  { code: '+27', flag: '🇿🇦', label: 'ZA' },
  { code: '+82', flag: '🇰🇷', label: 'KR' },
  { code: '+7', flag: '🇷🇺', label: 'RU' },
  { code: '+52', flag: '🇲🇽', label: 'MX' },
  { code: '+62', flag: '🇮🇩', label: 'ID' },
  { code: '+39', flag: '🇮🇹', label: 'IT' },
  { code: '+34', flag: '🇪🇸', label: 'ES' },
  { code: '+90', flag: '🇹🇷', label: 'TR' },
]

function detectCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
    const tzLower = tz.toLowerCase()

    if (tzLower.includes('kolkata') || tzLower.includes('calcutta')) return '+91'
    if (tzLower.includes('dubai') || tzLower.includes('muscat')) return '+971'
    if (tzLower.includes('riyadh')) return '+966'
    if (tzLower.includes('london')) return '+44'
    if (tzLower.includes('sydney') || tzLower.includes('melbourne')) return '+61'
    if (tzLower.includes('tokyo')) return '+81'
    if (tzLower.includes('berlin') || tzLower.includes('europe/berlin')) return '+49'
    if (tzLower.includes('paris')) return '+33'
    if (tzLower.includes('shanghai') || tzLower.includes('hong_kong')) return '+86'
    if (tzLower.includes('sao_paulo')) return '+55'
    if (tzLower.includes('lagos')) return '+234'
    if (tzLower.includes('johannesburg')) return '+27'
    if (tzLower.includes('seoul')) return '+82'
    if (tzLower.includes('moscow')) return '+7'
    if (tzLower.includes('mexico')) return '+52'
    if (tzLower.includes('jakarta')) return '+62'
    if (tzLower.includes('rome')) return '+39'
    if (tzLower.includes('madrid')) return '+34'
    if (tzLower.includes('istanbul')) return '+90'
    if (tzLower.startsWith('america/')) return '+1'

    return '+1'
  } catch {
    return '+1'
  }
}

export function AuthForm({ mode, isSubmitting, error, onSubmit, submitLabel }: Props) {
  const [name, setName] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmError, setConfirmError] = useState('')

  useEffect(() => {
    if (mode === 'register') {
      setCountryCode(detectCountryCode())
    }
  }, [mode])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setConfirmError('Passwords do not match')
        return
      }
      setConfirmError('')

      const phone = phoneNumber.trim()
        ? `${countryCode}${phoneNumber.trim()}`
        : undefined

      onSubmit({ name: name.trim(), phone, email: email.trim(), password })
    } else {
      onSubmit({ email: email.trim(), password })
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {mode === 'register' ? (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-neutral-500" htmlFor="auth-name">
              Full name
            </label>
            <input
              autoComplete="name"
              autoFocus
              className={inputClasses}
              id="auth-name"
              maxLength={100}
              onChange={(event) => setName(event.target.value)}
              placeholder="John Doe"
              required
              type="text"
              value={name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-neutral-500" htmlFor="auth-phone">
              Phone <span className="normal-case tracking-normal text-neutral-400">(optional)</span>
            </label>
            <div className="flex">
              <div className="relative">
                <select
                  aria-label="Country code"
                  className="h-full appearance-none border border-r-0 border-neutral-300 bg-neutral-50 py-3 pl-3 pr-8 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  onChange={(event) => setCountryCode(event.target.value)}
                  value={countryCode}
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
              </div>
              <input
                autoComplete="tel-national"
                className={`${inputClasses} border-l-0`}
                id="auth-phone"
                maxLength={12}
                onChange={(event) => setPhoneNumber(event.target.value.replace(/[^\d]/g, '').slice(0, 12))}
                placeholder="1234567890"
                type="tel"
                value={phoneNumber}
              />
            </div>
          </div>
        </>
      ) : null}

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-[0.3em] text-neutral-500" htmlFor="auth-email">
          Email
        </label>
        <input
          autoComplete="email"
          autoFocus={mode === 'login'}
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
        <label className="text-xs uppercase tracking-[0.3em] text-neutral-500" htmlFor="auth-password">
          Password
        </label>
        <input
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className={inputClasses}
          id="auth-password"
          minLength={mode === 'register' ? 8 : 1}
          onChange={(event) => {
            setPassword(event.target.value)
            setConfirmError('')
          }}
          placeholder="••••••••"
          required
          type="password"
          value={password}
        />
        {mode === 'register' ? (
          <p className="text-xs text-neutral-500">
            At least 8 characters including upper, lower, number, and a special character.
          </p>
        ) : null}
      </div>

      {mode === 'register' ? (
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-neutral-500" htmlFor="auth-confirm-password">
            Confirm password
          </label>
          <input
            autoComplete="new-password"
            className={[
              inputClasses,
              confirmError ? 'border-red-400' : '',
            ].join(' ')}
            id="auth-confirm-password"
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setConfirmError('')
            }}
            placeholder="••••••••"
            required
            type="password"
            value={confirmPassword}
          />
          {confirmError ? (
            <p className="text-xs text-red-600">{confirmError}</p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {extractErrorMessage(error, mode === 'login' ? 'Unable to sign in' : 'Unable to create account')}
        </p>
      ) : null}

      <button
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
            Working…
          </>
        ) : (
          submitLabel
        )}
      </button>

      <div className="relative flex items-center gap-4">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs text-neutral-400">or</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        className="inline-flex items-center justify-center gap-3 border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
        type="button"
        onClick={() => {
          // TODO: wire up Google OAuth
        }}
      >
        <svg className="size-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>
    </form>
  )
}
