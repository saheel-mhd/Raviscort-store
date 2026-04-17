import { Heart, MapPin, Receipt, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import { useAddresses } from '@/modules/account/hooks/use-addresses'
import { useWishlist } from '@/modules/account/hooks/use-wishlist'
import { useMyOrders } from '@/modules/orders/hooks/use-my-orders'
import { orderDetailPath, routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export default function AccountOverviewPage() {
  usePageTitle('Account')

  const user = useAuthStore((state) => state.user)
  const ordersQuery = useMyOrders({ page: 1, limit: 3 })
  const addressesQuery = useAddresses()
  const wishlistQuery = useWishlist()

  const mostRecent = ordersQuery.data?.orders[0]
  const addressCount = addressesQuery.data?.addresses.length ?? 0
  const wishlistCount = wishlistQuery.data?.products.length ?? 0
  const orderCount = ordersQuery.data?.pagination.total ?? 0

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
          Welcome back
        </p>
        <h1 className="mt-1 font-serif text-3xl font-normal tracking-tight text-neutral-900">
          {user?.email ?? 'your account'}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Receipt} label="Orders" value={orderCount} />
        <StatCard icon={MapPin} label="Addresses" value={addressCount} />
        <StatCard icon={Heart} label="Wishlist" value={wishlistCount} />
        <StatCard icon={User} label="Profile" value="—" hint="Change password" />
      </div>

      <section className="border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">
            Most recent order
          </h2>
          <Link
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
            to={routePaths.myOrders}
          >
            View all
          </Link>
        </div>

        {ordersQuery.isLoading ? (
          <p className="mt-4 text-sm text-neutral-500">Loading…</p>
        ) : mostRecent ? (
          <Link
            className="mt-4 flex items-center justify-between gap-4 border-t border-neutral-200 pt-4"
            to={orderDetailPath(mostRecent.id)}
          >
            <div>
              <p className="font-medium text-neutral-900">{mostRecent.orderNumber}</p>
              <p className="text-xs text-neutral-500">
                {dateFormatter.format(new Date(mostRecent.createdAt))} ·{' '}
                {mostRecent.items.length} item{mostRecent.items.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-neutral-900 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                {mostRecent.status}
              </span>
              <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                ${currencyFormatter.format(mostRecent.totalAmount)}
              </span>
            </div>
          </Link>
        ) : (
          <p className="mt-4 text-sm text-neutral-500">You haven’t placed any orders yet.</p>
        )}
      </section>
    </div>
  )
}

type StatCardProps = {
  icon: typeof Receipt
  label: string
  value: number | string
  hint?: string
}

function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <article className="flex flex-col gap-2 border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">{label}</p>
        <Icon className="size-4 text-neutral-400" strokeWidth={1.5} />
      </div>
      <p className="text-3xl font-semibold text-neutral-900">{value}</p>
      {hint ? <p className="text-xs text-neutral-500">{hint}</p> : null}
    </article>
  )
}
