import { LogOut, ShoppingBag, ShoppingCart, User } from 'lucide-react'
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2 text-white" to={routePaths.home}>
            <ShoppingBag className="size-5 text-sky-300" />
            <span className="text-lg font-semibold tracking-tight">Raviscort</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              aria-label="Cart"
              className="relative rounded-lg p-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
              to={routePaths.cart}
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-sky-400 text-[10px] font-semibold text-slate-950">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:inline-flex"
                  to={routePaths.myOrders}
                >
                  <User className="size-4" />
                  <span className="max-w-[10rem] truncate">{user?.email}</span>
                </Link>
                <button
                  aria-label="Sign out"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
                  onClick={handleSignOut}
                  type="button"
                >
                  <LogOut className="size-5" />
                </button>
              </div>
            ) : (
              <Link
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
                to={routePaths.login}
              >
                <User className="size-4" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-slate-950/60">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-6 text-xs text-slate-400 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Raviscort. All rights reserved.</p>
          <p className="hidden sm:block">Crafted with care.</p>
        </div>
      </footer>
    </div>
  )
}
