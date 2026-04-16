import { ArrowLeft, Package } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useOrder } from '@/modules/orders/hooks/use-order'
import { routePaths } from '@/routes/paths'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'long',
  timeStyle: 'short',
})

export default function OrderDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const query = useOrder(id)

  usePageTitle(query.data ? `Order ${query.data.orderNumber}` : 'Order')

  if (!id) {
    return <Navigate replace to={routePaths.myOrders} />
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={routePaths.myOrders}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        All orders
      </Link>

      {query.isLoading ? (
        <p className="text-sm text-slate-400">Loading order…</p>
      ) : query.isError ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {extractErrorMessage(query.error, 'Failed to load order')}
        </p>
      ) : query.data ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">{query.data.orderNumber}</h1>
              <p className="mt-1 text-xs text-slate-500">
                Placed {dateFormatter.format(new Date(query.data.createdAt))}
              </p>
            </div>
            <span className="inline-flex items-center self-start rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
              {query.data.status}
            </span>
          </div>

          <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Items
            </h2>
            <ul className="mt-4 flex flex-col divide-y divide-white/5 text-sm">
              {query.data.items.map((item) => (
                <li key={item.productId} className="flex items-start justify-between gap-4 py-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <Package className="mt-0.5 size-4 text-slate-500" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        SKU {item.sku} · {item.quantity} × ${currencyFormatter.format(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="tabular-nums text-white">
                    ${currencyFormatter.format(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4 text-sm">
              <Row label="Subtotal" value={query.data.subtotalAmount} />
              {query.data.discountAmount > 0 ? (
                <Row label="Discount" value={-query.data.discountAmount} />
              ) : null}
              <Row label="Total" value={query.data.totalAmount} bold />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? 'text-base font-semibold text-white' : 'text-slate-300'
      }`}
    >
      <span>{label}</span>
      <span className="tabular-nums">
        {value < 0 ? '-' : ''}${currencyFormatter.format(Math.abs(value))}
      </span>
    </div>
  )
}
