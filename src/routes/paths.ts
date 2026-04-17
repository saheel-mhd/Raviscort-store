export const routePaths = {
  home: '/',
  products: '/products',
  productDetail: '/products/:id',
  cart: '/cart',
  checkout: '/checkout',
  orderSuccess: '/orders/success/:id',
  login: '/login',
  register: '/register',
  accountOverview: '/account',
  myOrders: '/account/orders',
  orderDetail: '/account/orders/:id',
  accountProfile: '/account/profile',
  accountAddresses: '/account/addresses',
  accountSupport: '/account/support',
  accountSupportNew: '/account/support/new',
  accountSupportDetail: '/account/support/:id',
  accountWishlist: '/account/wishlist',
} as const

export function productPath(id: string) {
  return `/products/${id}`
}

export function orderSuccessPath(id: string) {
  return `/orders/success/${id}`
}

export function orderDetailPath(id: string) {
  return `/account/orders/${id}`
}

export function supportDetailPath(id: string) {
  return `/account/support/${id}`
}
