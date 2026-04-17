import { useRef, useState } from 'react'
import { CheckCircle2, Loader2, Tag, X } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { apiClient, extractErrorMessage, type ApiEnvelope } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCartActions, useCartItems, useCartSubtotal } from '@/modules/cart/hooks/use-cart'
import { useCreateOrder } from '@/modules/orders/hooks/use-create-order'
import type { Order } from '@/modules/orders/types/order.types'
import { orderDetailPath, routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

type CouponValidation = {
  couponId: string
  code: string
  type: 'percentage' | 'fixed'
  subtotalAmount: number
  discountAmount: number
  totalAmount: number
  isValid: true
}

export default function CheckoutPage() {
  usePageTitle('Checkout')

  const navigate = useNavigate()
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const { clear } = useCartActions()
  const user = useAuthStore((state) => state.user)
  const { mutate: createOrder, isPending: isCreating, error: createError } = useCreateOrder()

  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState<CouponValidation | null>(null)
  const [couponError, setCouponError] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const orderPlaced = useRef(false)

  if (items.length === 0 && !orderPlaced.current) {
    return <Navigate replace to={routePaths.cart} />
  }

  const discountAmount = couponResult?.discountAmount ?? 0
  const total = subtotal - discountAmount

  const handlePlaceOrder = () => {
    setIsPlacing(true)

    createOrder(
      {
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: async (order) => {
          let finalOrderId = order.id
          if (couponResult) {
            try {
              const response = await apiClient.post<ApiEnvelope<Order>>(
                '/coupons/apply',
                { code: couponResult.code, orderId: order.id }
              )
              finalOrderId = response.data.data.id
            } catch {
              // coupon failed to apply, proceed with original order
            }
          }
          orderPlaced.current = true
          clear()
          navigate(orderDetailPath(finalOrderId), { replace: true })
          setIsPlacing(false)
        },
        onError: () => {
          setIsPlacing(false)
        },
      }
    )
  }

  const handleValidateCoupon = async () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) return

    setCouponError('')
    setIsApplying(true)

    try {
      const tempOrder = await apiClient.post<ApiEnvelope<Order>>('/orders', {
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      })

      const response = await apiClient.post<ApiEnvelope<CouponValidation>>(
        '/coupons/validate',
        { code, orderId: tempOrder.data.data.id }
      )

      setCouponResult(response.data.data)
    } catch (error) {
      setCouponError(extractErrorMessage(error, 'Invalid coupon code'))
      setCouponResult(null)
    } finally {
      setIsApplying(false)
    }
  }

  const removeCoupon = () => {
    setCouponResult(null)
    setCouponCode('')
    setCouponError('')
  }

  const isPending = isCreating || isPlacing

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

        <section className="border border-neutral-200 bg-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Discount code
          </h2>

          {couponResult ? (
            <div className="mt-3 flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-emerald-600" strokeWidth={1.5} />
                <span className="font-mono font-medium text-emerald-900">{couponResult.code}</span>
                <span className="text-emerald-700">
                  −${currencyFormatter.format(couponResult.discountAmount)}
                </span>
              </div>
              <button
                className="text-neutral-400 transition hover:text-neutral-700"
                onClick={removeCoupon}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.5} />
                <input
                  className="h-11 w-full border border-neutral-300 bg-white pl-9 pr-3 font-mono text-sm uppercase text-neutral-900 placeholder:normal-case placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                  disabled={isApplying}
                  onChange={(event) => {
                    setCouponCode(event.target.value)
                    setCouponError('')
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleValidateCoupon()
                    }
                  }}
                  placeholder="Enter coupon code"
                  type="text"
                  value={couponCode}
                />
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isApplying || !couponCode.trim()}
                onClick={handleValidateCoupon}
                type="button"
              >
                {isApplying ? (
                  <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          )}

          {couponError ? (
            <p className="mt-2 text-xs text-red-600">{couponError}</p>
          ) : null}
        </section>

        {createError ? (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {extractErrorMessage(createError, 'Unable to place order')}
          </p>
        ) : null}
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Summary</h2>
        <div className="flex items-center justify-between text-sm text-neutral-700">
          <span>Subtotal</span>
          <span className="tabular-nums">${currencyFormatter.format(subtotal)}</span>
        </div>
        {discountAmount > 0 ? (
          <div className="flex items-center justify-between text-sm text-emerald-700">
            <span>Discount ({couponResult?.code})</span>
            <span className="tabular-nums">−${currencyFormatter.format(discountAmount)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>Shipping</span>
          <span>Free · at cost later</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900">
          <span>Total</span>
          <span className="tabular-nums">${currencyFormatter.format(total)}</span>
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
