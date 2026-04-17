import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useComplaint } from '@/modules/account/hooks/use-complaints'
import type { ComplaintStatus } from '@/modules/account/types/account.types'
import { routePaths } from '@/routes/paths'

const statusStyles: Record<ComplaintStatus, string> = {
  open: 'bg-amber-100 text-amber-900',
  in_progress: 'bg-sky-100 text-sky-900',
  resolved: 'bg-emerald-100 text-emerald-900',
  closed: 'bg-neutral-100 text-neutral-600',
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'long',
  timeStyle: 'short',
})

export default function AccountSupportDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const query = useComplaint(id)

  usePageTitle(query.data?.subject ?? 'Request')

  if (!id) {
    return <Navigate replace to={routePaths.accountSupport} />
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

      {query.isLoading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : query.isError ? (
        <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {extractErrorMessage(query.error, 'Failed to load request')}
        </p>
      ) : query.data ? (
        <>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
              Support request
            </p>
            <h1 className="mt-1 font-serif text-2xl font-normal tracking-tight text-neutral-900 sm:text-3xl">
              {query.data.subject}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
              <span
                className={`inline-flex items-center px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${statusStyles[query.data.status]}`}
              >
                {query.data.status.replace('_', ' ')}
              </span>
              <span>Opened {dateFormatter.format(new Date(query.data.createdAt))}</span>
            </div>
          </div>

          <section className="border border-neutral-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Your message
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-800">
              {query.data.message}
            </p>
          </section>

          <section className="border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Our reply
            </p>
            {query.data.adminReply ? (
              <>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-800">
                  {query.data.adminReply}
                </p>
                {query.data.repliedAt ? (
                  <p className="mt-3 text-xs text-neutral-500">
                    Replied {dateFormatter.format(new Date(query.data.repliedAt))}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-3 text-sm text-neutral-500">
                We haven’t replied yet. Check back soon.
              </p>
            )}
          </section>
        </>
      ) : null}
    </div>
  )
}
