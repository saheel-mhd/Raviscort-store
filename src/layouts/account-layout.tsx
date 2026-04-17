import { Heart, Home, LifeBuoy, MapPin, Receipt, User } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { routePaths } from '@/routes/paths'
import { cn } from '@/utils/cn'

const navItems = [
  { label: 'Overview', to: routePaths.accountOverview, icon: Home, end: true },
  { label: 'Orders', to: routePaths.myOrders, icon: Receipt, end: false },
  { label: 'Profile', to: routePaths.accountProfile, icon: User, end: true },
  { label: 'Addresses', to: routePaths.accountAddresses, icon: MapPin, end: true },
  { label: 'Support', to: routePaths.accountSupport, icon: LifeBuoy, end: false },
  { label: 'Wishlist', to: routePaths.accountWishlist, icon: Heart, end: true },
] as const

export function AccountLayout() {
  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
      <aside className="flex flex-col gap-1">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
          Account
        </p>
        <nav className="flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                end={item.end}
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-3 border-l-2 px-4 py-3 text-sm transition',
                    isActive
                      ? 'border-neutral-900 bg-neutral-100 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900',
                  )
                }
              >
                <Icon className="size-4" strokeWidth={1.5} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <section>
        <Outlet />
      </section>
    </div>
  )
}
