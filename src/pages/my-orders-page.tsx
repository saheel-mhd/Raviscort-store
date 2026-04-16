import { Link } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useMyOrders } from '@/modules/orders/hooks/use-my-orders'
import { orderDetailPath, routePaths } from '@/routes/paths'
import { PaginationControls } from '@/shared/pagination-controls'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
})

const DEFAULT_LIMIT = 10

export default function MyOrdersPage() {
  usePageTitle('My orders')

  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(() => {
    const page = Number(searchParams.get('page') ?? '1') || 1
    return { page, limit: DEFAULT_LIMIT }
  }, [searchParams])

  const query = useMyOrders(params)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-sky-300">Account</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">My orders</h1>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-slate-400">Loading orders…</p>
      ) : query.isError ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {extractErrorMessage(query.error, 'Failed to load orders')}
        </p>
      ) : query.data && query.data.orders.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
          <p className="text-sm text-slate-400">You haven’t placed any orders yet.</p>
          <Link
            className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            to={routePaths.products}
          >
            Shop now
          </Link>
        </div>
      ) : query.data ? (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col divide-y divide-white/5 rounded-2xl border border-white/10 bg-slate-950/60">
            {query.data.orders.map((order) => (
              <li key={order.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    className="font-medium text-white hover:text-sky-300"
                    to={orderDetailPath(order.id)}
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {dateFormatter.format(new Date(order.createdAt))} · {order.items.length} item
                    {order.items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-white tabular-nums">
                    ${currencyFormatter.format(order.totalAmount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <PaginationControls
            limit={query.data.pagination.limit}
            onChange={(page) =>
              setSearchParams(
                (prev) => {
                  const merged = new URLSearchParams(prev)
                  merged.set('page', String(page))
                  return merged
                },
                { replace: true }
              )
            }
            page={query.data.pagination.page}
            total={query.data.pagination.total}
            totalPages={query.data.pagination.totalPages}
          />
        </div>
      ) : null}
    </div>
  )
}
