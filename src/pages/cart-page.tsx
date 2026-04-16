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
        <ShoppingBag className="size-10 text-neutral-300" strokeWidth={1} />
        <h1 className="text-3xl font-semibold text-neutral-900">Your cart is empty</h1>
        <p className="max-w-md text-sm text-neutral-500">
          Find something you love in the shop — items you add will appear here.
        </p>
        <Link
          to={routePaths.products}
          className="mt-4 inline-flex items-center bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
        >
          Browse the shop
        </Link>
      </section>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Cart</h1>

        <ul className="flex flex-col divide-y divide-neutral-200 border border-neutral-200">
          {items.map((item) => {
            const disableIncrease = item.quantity >= item.maxStock
            return (
              <li key={item.productVariantId} className="flex items-start gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <Link
                    to={productPath(item.productId)}
                    className="block truncate font-medium text-neutral-900 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    Size{' '}
                    <span className="text-neutral-700">{item.sizeShortName}</span>
                    {' · SKU '}
                    {item.sku}
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">
                    ${currencyFormatter.format(item.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-1 border border-neutral-300 p-1">
                  <button
                    aria-label="Decrease quantity"
                    className="p-2 text-neutral-700 hover:text-neutral-900 disabled:opacity-30"
                    disabled={item.quantity <= 1}
                    onClick={() => setQuantity(item.productVariantId, item.quantity - 1)}
                    type="button"
                  >
                    <Minus className="size-3.5" strokeWidth={1.5} />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    className="p-2 text-neutral-700 hover:text-neutral-900 disabled:opacity-30"
                    disabled={disableIncrease}
                    onClick={() => setQuantity(item.productVariantId, item.quantity + 1)}
                    type="button"
                  >
                    <Plus className="size-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex w-24 flex-col items-end gap-2">
                  <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                    ${currencyFormatter.format(item.price * item.quantity)}
                  </span>
                  <button
                    aria-label={`Remove ${item.name}`}
                    className="text-neutral-400 hover:text-neutral-900"
                    onClick={() => removeItem(item.productVariantId)}
                    type="button"
                  >
                    <Trash2 className="size-4" strokeWidth={1.5} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Summary</h2>
        <div className="flex items-center justify-between text-sm text-neutral-700">
          <span>Subtotal</span>
          <span className="tabular-nums">${currencyFormatter.format(subtotal)}</span>
        </div>
        <p className="text-xs text-neutral-500">Shipping and taxes calculated at checkout.</p>
        <Link
          className="mt-2 inline-flex items-center justify-center bg-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
          to={routePaths.checkout}
        >
          Checkout
        </Link>
      </aside>
    </div>
  )
}
