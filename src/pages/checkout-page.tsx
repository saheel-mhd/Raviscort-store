import { Loader2 } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCartActions, useCartItems, useCartSubtotal } from '@/modules/cart/hooks/use-cart'
import { useCreateOrder } from '@/modules/orders/hooks/use-create-order'
import { orderSuccessPath, routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function CheckoutPage() {
  usePageTitle('Checkout')

  const navigate = useNavigate()
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const { clear } = useCartActions()
  const user = useAuthStore((state) => state.user)
  const { mutate, isPending, error } = useCreateOrder()

  if (items.length === 0) {
    return <Navigate replace to={routePaths.cart} />
  }

  const handlePlaceOrder = () => {
    mutate(
      {
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (order) => {
          clear()
          navigate(orderSuccessPath(order.id), { replace: true })
        },
      }
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Checkout</h1>

        <section className="border border-neutral-200 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Account
          </h2>
          <p className="mt-3 text-sm text-neutral-600">
            Signed in as <span className="text-neutral-900">{user?.email}</span>
          </p>
        </section>

        <section className="border border-neutral-200 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Order review
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-neutral-200 text-sm">
            {items.map((item) => (
              <li key={item.productVariantId} className="flex justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-900">
                    {item.name} · <span className="text-neutral-500">{item.sizeShortName}</span>
                  </p>
                  <p className="text-xs text-neutral-500">
                    {item.quantity} × ${currencyFormatter.format(item.price)}
                  </p>
                </div>
                <span className="tabular-nums text-neutral-900">
                  ${currencyFormatter.format(item.quantity * item.price)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {error ? (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {extractErrorMessage(error, 'Unable to place order')}
          </p>
        ) : null}
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Summary</h2>
        <div className="flex items-center justify-between text-sm text-neutral-700">
          <span>Subtotal</span>
          <span className="tabular-nums">${currencyFormatter.format(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>Shipping</span>
          <span>Free · at cost later</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900">
          <span>Total</span>
          <span className="tabular-nums">${currencyFormatter.format(subtotal)}</span>
        </div>
        <button
          className="mt-2 inline-flex items-center justify-center gap-2 bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
          onClick={handlePlaceOrder}
          type="button"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
              Placing order…
            </>
          ) : (
            'Place order'
          )}
        </button>
        <Link
          className="text-center text-xs text-neutral-500 hover:text-neutral-900"
          to={routePaths.cart}
        >
          Back to cart
        </Link>
      </aside>
    </div>
  )
}
