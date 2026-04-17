import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useWishlist } from '@/modules/account/hooks/use-wishlist'
import { ProductCard } from '@/modules/products/components/product-card'
import { routePaths } from '@/routes/paths'

export default function AccountWishlistPage() {
  usePageTitle('Wishlist')

  const query = useWishlist()
  const products = query.data?.products ?? []

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
          Wishlist
        </p>
        <h1 className="mt-1 font-serif text-3xl font-normal tracking-tight text-neutral-900">
          Saved for later
        </h1>
      </div>

      {query.isLoading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : query.isError ? (
        <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {extractErrorMessage(query.error, 'Failed to load wishlist')}
        </p>
      ) : products.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
          <Heart className="size-8 text-neutral-300" strokeWidth={1} />
          <p className="text-sm text-neutral-500">
            Nothing saved yet. Tap the heart on any product to keep it here.
          </p>
          <Link
            className="mt-2 inline-flex items-center bg-neutral-900 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
            to={routePaths.products}
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
