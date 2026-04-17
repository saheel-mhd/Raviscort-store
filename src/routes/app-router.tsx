import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import { AppLoader } from '@/components/app-loader'
import { AccountLayout } from '@/layouts/account-layout'
import { StoreLayout } from '@/layouts/store-layout'
import { RequireAuth } from '@/routes/require-auth'
import { routePaths } from '@/routes/paths'

const HomePage = lazy(() => import('@/pages/home-page'))
const ProductsListPage = lazy(() => import('@/pages/products-list-page'))
const ProductDetailPage = lazy(() => import('@/pages/product-detail-page'))
const CartPage = lazy(() => import('@/pages/cart-page'))
const CheckoutPage = lazy(() => import('@/pages/checkout-page'))
const OrderSuccessPage = lazy(() => import('@/pages/order-success-page'))
const LoginPage = lazy(() => import('@/pages/login-page'))
const RegisterPage = lazy(() => import('@/pages/register-page'))
const NotFoundPage = lazy(() => import('@/pages/not-found-page'))

const AccountOverviewPage = lazy(() => import('@/pages/account-overview-page'))
const MyOrdersPage = lazy(() => import('@/pages/my-orders-page'))
const OrderDetailPage = lazy(() => import('@/pages/order-detail-page'))
const AccountProfilePage = lazy(() => import('@/pages/account-profile-page'))
const AccountAddressesPage = lazy(() => import('@/pages/account-addresses-page'))
const AccountSupportPage = lazy(() => import('@/pages/account-support-page'))
const AccountSupportNewPage = lazy(() => import('@/pages/account-support-new-page'))
const AccountSupportDetailPage = lazy(() => import('@/pages/account-support-detail-page'))
const AccountWishlistPage = lazy(() => import('@/pages/account-wishlist-page'))

export function AppRouter() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path={routePaths.products} element={<ProductsListPage />} />
          <Route path={routePaths.productDetail} element={<ProductDetailPage />} />
          <Route path={routePaths.cart} element={<CartPage />} />
          <Route path={routePaths.login} element={<LoginPage />} />
          <Route path={routePaths.register} element={<RegisterPage />} />

          <Route
            path={routePaths.checkout}
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path={routePaths.orderSuccess}
            element={
              <RequireAuth>
                <OrderSuccessPage />
              </RequireAuth>
            }
          />

          <Route
            element={
              <RequireAuth>
                <AccountLayout />
              </RequireAuth>
            }
          >
            <Route path={routePaths.accountOverview} element={<AccountOverviewPage />} />
            <Route path={routePaths.myOrders} element={<MyOrdersPage />} />
            <Route path={routePaths.orderDetail} element={<OrderDetailPage />} />
            <Route path={routePaths.accountProfile} element={<AccountProfilePage />} />
            <Route path={routePaths.accountAddresses} element={<AccountAddressesPage />} />
            <Route path={routePaths.accountSupport} element={<AccountSupportPage />} />
            <Route path={routePaths.accountSupportNew} element={<AccountSupportNewPage />} />
            <Route path={routePaths.accountSupportDetail} element={<AccountSupportDetailPage />} />
            <Route path={routePaths.accountWishlist} element={<AccountWishlistPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
