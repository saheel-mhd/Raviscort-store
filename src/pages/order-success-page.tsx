import { CheckCircle2, Package } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useOrder } from '@/modules/orders/hooks/use-order'
import { orderDetailPath, routePaths } from '@/routes/paths'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function OrderSuccessPage() {
  usePageTitle('Order placed')

  const { id = '' } = useParams<{ id: string }>()
  const query = useOrder(id)

  if (!id) {
    return <Navigate replace to={routePaths.products} />
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <CheckCircle2 className="size-10 text-emerald-300" />
        <h1 className="text-3xl font-semibold text-white">Order placed</h1>
        <p className="text-sm text-slate-400">
          Thanks for your purchase. We’ve started processing it.
        </p>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-slate-400">Loading order…</p>
      ) : query.isError ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {extractErrorMessage(query.error, 'Failed to load order')}
        </p>
      ) : query.data ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order number</p>
              <p className="text-lg font-semibold text-white">{query.data.orderNumber}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
              {query.data.status}
            </span>
          </div>

          <ul className="flex flex-col divide-y divide-white/5 text-sm">
            {query.data.items.map((item) => (
              <li key={item.productId} className="flex items-start justify-between gap-4 py-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Package className="mt-0.5 size-4 text-slate-500" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} × ${currencyFormatter.format(item.price)}
                    </p>
                  </div>
                </div>
                <span className="tabular-nums text-white">
                  ${currencyFormatter.format(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-base font-semibold text-white">
            <span>Total</span>
            <span className="tabular-nums">
              ${currencyFormatter.format(query.data.totalAmount)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex justify-center gap-3">
        {query.data ? (
          <Link
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            to={orderDetailPath(query.data.id)}
          >
            View order
          </Link>
        ) : null}
        <Link
          className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
          to={routePaths.products}
        >
          Keep shopping
        </Link>
      </div>
    </section>
  )
}
