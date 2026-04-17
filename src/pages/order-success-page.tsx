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
        <CheckCircle2 className="size-10 text-neutral-900" strokeWidth={1.25} />
        <h1 className="text-3xl font-semibold text-neutral-900">Order placed</h1>
        <p className="text-sm text-neutral-500">
          Thanks for your purchase. We’ve started processing it.
        </p>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-neutral-500">Loading order…</p>
      ) : query.isError ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {extractErrorMessage(query.error, 'Failed to load order')}
        </p>
      ) : query.data ? (
        <div className="flex flex-col gap-4 border border-neutral-200 bg-white p-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Order number</p>
              <p className="text-lg font-semibold text-neutral-900">{query.data.orderNumber}</p>
            </div>
            <span className="inline-flex items-center bg-neutral-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
              {query.data.status}
            </span>
          </div>

          <ul className="flex flex-col divide-y divide-neutral-200 text-sm">
            {query.data.items.map((item, index) => {
              const price = item.unitPrice ?? item.price ?? 0
              return (
                <li
                  key={`${item.productVariantId ?? item.productId}-${index}`}
                  className="flex items-start justify-between gap-4 py-3"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <Package className="mt-0.5 size-4 text-neutral-400" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-900">
                        {item.name}
                        {item.unitShortName ? (
                          <span className="ml-2 text-neutral-500">· {item.unitShortName}</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {item.quantity} × ${currencyFormatter.format(price)}
                      </p>
                    </div>
                  </div>
                  <span className="tabular-nums text-neutral-900">
                    ${currencyFormatter.format(price * item.quantity)}
                  </span>
                </li>
              )
            })}
          </ul>

          {query.data.discountAmount > 0 ? (
            <>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-sm text-neutral-600">
                <span>Subtotal</span>
                <span className="tabular-nums">
                  ${currencyFormatter.format(query.data.subtotalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-emerald-700">
                <span>Discount</span>
                <span className="tabular-nums">
                  −${currencyFormatter.format(query.data.discountAmount)}
                </span>
              </div>
            </>
          ) : null}
          <div className={[
            'flex items-center justify-between text-base font-semibold text-neutral-900',
            query.data.discountAmount > 0 ? 'pt-2' : 'border-t border-neutral-200 pt-4',
          ].join(' ')}>
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
            className="inline-flex items-center justify-center bg-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
            to={orderDetailPath(query.data.id)}
          >
            View order
          </Link>
        ) : null}
        <Link
          className="inline-flex items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-neutral-900 transition hover:border-neutral-900"
          to={routePaths.products}
        >
          Keep shopping
        </Link>
      </div>
    </section>
  )
}
