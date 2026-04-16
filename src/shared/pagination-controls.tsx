import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  page: number
  totalPages: number
  total: number
  limit: number
  onChange: (page: number) => void
}

const buttonBase =
  'inline-flex items-center gap-1 border border-neutral-300 bg-white px-3 py-2 text-xs font-medium uppercase tracking-widest text-neutral-900 transition hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-40'

export function PaginationControls({ page, totalPages, total, limit, onChange }: Props) {
  if (total === 0) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-neutral-500">
        Showing <span className="text-neutral-900">{start}</span>–
        <span className="text-neutral-900">{end}</span> of{' '}
        <span className="text-neutral-900">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          aria-label="Previous page"
          className={buttonBase}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          type="button"
        >
          <ChevronLeft className="size-3.5" strokeWidth={1.5} />
          Previous
        </button>
        <span className="text-xs text-neutral-500">
          Page {page} / {Math.max(totalPages, 1)}
        </span>
        <button
          aria-label="Next page"
          className={buttonBase}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          type="button"
        >
          Next
          <ChevronRight className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
