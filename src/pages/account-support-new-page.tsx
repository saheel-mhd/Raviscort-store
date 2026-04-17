import { useState, type FormEvent } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCreateComplaint } from '@/modules/account/hooks/use-complaints'
import { routePaths, supportDetailPath } from '@/routes/paths'

const inputClasses =
  'w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none'

export default function AccountSupportNewPage() {
  usePageTitle('New request')

  const navigate = useNavigate()
  const { mutate, isPending, error } = useCreateComplaint()

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate(
      { subject: subject.trim(), message: message.trim() },
      {
        onSuccess: (complaint) => navigate(supportDetailPath(complaint.id), { replace: true }),
      },
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        to={routePaths.accountSupport}
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        All requests
      </Link>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">Support</p>
        <h1 className="mt-1 font-serif text-3xl font-normal tracking-tight text-neutral-900">
          New request
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-500">
          Tell us what happened. We usually respond within one business day.
        </p>
      </div>

      <form className="flex flex-col gap-4 border border-neutral-200 bg-white p-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-neutral-500" htmlFor="subject">
            Subject
          </label>
          <input
            className={inputClasses}
            id="subject"
            maxLength={160}
            minLength={3}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Wrong size received"
            required
            type="text"
            value={subject}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-neutral-500" htmlFor="message">
            Message
          </label>
          <textarea
            className={`${inputClasses} min-h-40`}
            id="message"
            maxLength={2000}
            minLength={5}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Share what happened, and include your order number if relevant."
            required
            value={message}
          />
        </div>

        {error ? (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {extractErrorMessage(error, 'Unable to send request')}
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
              Sending…
            </>
          ) : (
            'Send request'
          )}
        </button>
      </form>
    </div>
  )
}
