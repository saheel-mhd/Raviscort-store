export const routePaths = {
  home: '/',
  products: '/products',
  productDetail: '/products/:id',
  cart: '/cart',
  checkout: '/checkout',
  orderSuccess: '/orders/success/:id',
  login: '/login',
  register: '/register',
  myOrders: '/account/orders',
  orderDetail: '/account/orders/:id',
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
