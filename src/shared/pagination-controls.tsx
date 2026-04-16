import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  page: number
  totalPages: number
  total: number
  limit: number
  onChange: (page: number) => void
}

const buttonBase =
  'inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40'

export function PaginationControls({ page, totalPages, total, limit, onChange }: Props) {
  if (total === 0) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-400">
        Showing <span className="text-slate-200">{start}</span>–
        <span className="text-slate-200">{end}</span> of{' '}
        <span className="text-slate-200">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          aria-label="Previous page"
          className={buttonBase}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          type="button"
        >
          <ChevronLeft className="size-3.5" />
          Previous
        </button>
        <span className="text-xs text-slate-400">
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
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
