import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useMyOrders } from '@/modules/orders/hooks/use-my-orders'
import { orderDetailPath, routePaths } from '@/routes/paths'
import { PaginationControls } from '@/shared/pagination-controls'

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
        <span className="text-xs uppercase tracking-[0.4em] text-neutral-500">Account</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">My orders</h1>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-neutral-500">Loading orders…</p>
      ) : query.isError ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {extractErrorMessage(query.error, 'Failed to load orders')}
        </p>
      ) : query.data && query.data.orders.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-500">You haven’t placed any orders yet.</p>
          <Link
            className="inline-flex items-center bg-neutral-900 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
            to={routePaths.products}
          >
            Shop now
          </Link>
        </div>
      ) : query.data ? (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col divide-y divide-neutral-200 border border-neutral-200">
            {query.data.orders.map((order) => (
              <li key={order.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    className="font-medium text-neutral-900 hover:underline"
                    to={orderDetailPath(order.id)}
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    {dateFormatter.format(new Date(order.createdAt))} · {order.items.length} item
                    {order.items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center bg-neutral-900 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900 tabular-nums">
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
