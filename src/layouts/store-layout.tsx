import { LogOut, ShoppingBag, User } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useCartItemCount } from '@/modules/cart/hooks/use-cart'
import { routePaths } from '@/routes/paths'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/utils/cn'

const navItems = [
  { label: 'Shop', to: routePaths.products },
] as const

export function StoreLayout() {
  const cartCount = useCartItemCount()
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const navigate = useNavigate()

  const isAuthenticated = status === 'authenticated'

  const handleSignOut = () => {
    signOut()
    navigate(routePaths.home)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2 text-neutral-900" to={routePaths.home}>
            <span className="font-serif text-3xl font-normal tracking-tight sm:text-4xl">Raviscort</span>
          </Link>

          <nav className="flex items-center gap-5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium tracking-wide transition',
                    isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              aria-label="Cart"
              className="relative rounded-lg p-2 text-neutral-700 transition hover:bg-neutral-100"
              to={routePaths.cart}
            >
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <Link
                  className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:inline-flex"
                  to={routePaths.accountOverview}
                >
                  <User className="size-4" strokeWidth={1.5} />
                  <span className="max-w-[10rem] truncate">{user?.name ?? user?.email}</span>
                </Link>
                <button
                  aria-label="Sign out"
                  className="rounded-lg p-2 text-neutral-700 transition hover:bg-neutral-100"
                  onClick={handleSignOut}
                  type="button"
                >
                  <LogOut className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                to={routePaths.login}
              >
                <User className="size-4" strokeWidth={1.5} />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-8 text-xs tracking-wide text-neutral-500 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Raviscort. All rights reserved.</p>
          <p className="hidden uppercase tracking-[0.2em] sm:block">Crafted with purpose</p>
        </div>
      </footer>
    </div>
  )
}
