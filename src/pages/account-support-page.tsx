import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useMyComplaints } from '@/modules/account/hooks/use-complaints'
import type { ComplaintStatus } from '@/modules/account/types/account.types'
import { routePaths, supportDetailPath } from '@/routes/paths'

const statusStyles: Record<ComplaintStatus, string> = {
  open: 'bg-amber-100 text-amber-900',
  in_progress: 'bg-sky-100 text-sky-900',
  resolved: 'bg-emerald-100 text-emerald-900',
  closed: 'bg-neutral-100 text-neutral-600',
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export default function AccountSupportPage() {
  usePageTitle('Support')

  const [searchParams] = useSearchParams()
  const [page] = useState(Number(searchParams.get('page') ?? '1') || 1)

  const query = useMyComplaints(page)
  const complaints = query.data?.complaints ?? []

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
            Support
          </p>
          <h1 className="mt-1 font-serif text-3xl font-normal tracking-tight text-neutral-900">
            Your requests
          </h1>
        </div>
        <Link
          className="inline-flex items-center gap-2 bg-neutral-900 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
          to={routePaths.accountSupportNew}
        >
          <Plus className="size-4" strokeWidth={1.5} />
          New request
        </Link>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : query.isError ? (
        <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {extractErrorMessage(query.error, 'Failed to load requests')}
        </p>
      ) : complaints.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-500">
            No support requests yet. If something went wrong, we’re here to help.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-neutral-200 border border-neutral-200 bg-white">
          {complaints.map((complaint) => (
            <li key={complaint.id}>
              <Link
                className="flex items-center justify-between gap-4 p-5 hover:bg-neutral-50"
                to={supportDetailPath(complaint.id)}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-900">{complaint.subject}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                    {complaint.message}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {dateFormatter.format(new Date(complaint.createdAt))}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${statusStyles[complaint.status]}`}
                >
                  {complaint.status.replace('_', ' ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
