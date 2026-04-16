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
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
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
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Checkout</h1>

        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            Account
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Signed in as <span className="text-white">{user?.email}</span>
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            Order review
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-white/5 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.quantity} × ${currencyFormatter.format(item.price)}
                  </p>
                </div>
                <span className="tabular-nums text-white">
                  ${currencyFormatter.format(item.quantity * item.price)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {extractErrorMessage(error, 'Unable to place order')}
          </p>
        ) : null}
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <h2 className="text-lg font-semibold text-white">Summary</h2>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Subtotal</span>
          <span className="tabular-nums">${currencyFormatter.format(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Shipping</span>
          <span>Free · at cost later</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-4 text-base font-semibold text-white">
          <span>Total</span>
          <span className="tabular-nums">${currencyFormatter.format(subtotal)}</span>
        </div>
        <button
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
          onClick={handlePlaceOrder}
          type="button"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Placing order…
            </>
          ) : (
            'Place order'
          )}
        </button>
        <Link
          className="text-center text-xs text-slate-400 hover:text-white"
          to={routePaths.cart}
        >
          Back to cart
        </Link>
      </aside>
    </div>
  )
}
