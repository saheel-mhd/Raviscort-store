import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import {
  useCartActions,
  useCartItems,
  useCartSubtotal,
} from '@/modules/cart/hooks/use-cart'
import { productPath, routePaths } from '@/routes/paths'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function CartPage() {
  usePageTitle('Cart')

  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const { setQuantity, removeItem } = useCartActions()

  if (items.length === 0) {
    return (
      <section className="flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag className="size-10 text-slate-600" />
        <h1 className="text-3xl font-semibold text-white">Your cart is empty</h1>
        <p className="max-w-md text-sm text-slate-400">
          Find something you love in the shop — items you add will appear here.
        </p>
        <Link
          to={routePaths.products}
          className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Browse the shop
        </Link>
      </section>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Cart</h1>

        <ul className="flex flex-col divide-y divide-white/5 rounded-2xl border border-white/10 bg-slate-950/60">
          {items.map((item) => {
            const disableIncrease = item.quantity >= item.maxStock
            return (
              <li key={item.productId} className="flex items-start gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Link
                    to={productPath(item.productId)}
                    className="block truncate font-medium text-white hover:text-sky-300"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-500">SKU {item.sku}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    ${currencyFormatter.format(item.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/60 p-1">
                  <button
                    aria-label="Decrease quantity"
                    className="rounded-lg p-2 text-slate-300 hover:text-white disabled:opacity-40"
                    disabled={item.quantity <= 1}
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    type="button"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    className="rounded-lg p-2 text-slate-300 hover:text-white disabled:opacity-40"
                    disabled={disableIncrease}
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    type="button"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <div className="flex w-24 flex-col items-end gap-2">
                  <span className="text-sm font-semibold text-white tabular-nums">
                    ${currencyFormatter.format(item.price * item.quantity)}
                  </span>
                  <button
                    aria-label={`Remove ${item.name}`}
                    className="text-xs text-slate-400 hover:text-red-300"
                    onClick={() => removeItem(item.productId)}
                    type="button"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <h2 className="text-lg font-semibold text-white">Summary</h2>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Subtotal</span>
          <span className="tabular-nums">${currencyFormatter.format(subtotal)}</span>
        </div>
        <p className="text-xs text-slate-500">Shipping and taxes calculated at checkout.</p>
        <Link
          className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          to={routePaths.checkout}
        >
          Checkout
        </Link>
      </aside>
    </div>
  )
}
