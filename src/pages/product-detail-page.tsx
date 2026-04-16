import { useState } from 'react'
import { ArrowLeft, Check, Package, ShoppingBag } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCartActions } from '@/modules/cart/hooks/use-cart'
import { useProduct } from '@/modules/products/hooks/use-product'
import { routePaths } from '@/routes/paths'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function ProductDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const query = useProduct(id)
  const { addItem } = useCartActions()
  const [justAdded, setJustAdded] = useState(false)

  usePageTitle(query.data?.name)

  if (!id) {
    return <Navigate replace to={routePaths.products} />
  }

  const handleAddToCart = () => {
    if (!query.data) return
    addItem({
      productId: query.data.id,
      name: query.data.name,
      slug: query.data.slug,
      sku: query.data.sku,
      price: query.data.price,
      maxStock: query.data.stock,
      quantity: 1,
    })
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        to={routePaths.products}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to shop
      </Link>

      {query.isLoading ? (
        <div className="flex min-h-60 items-center justify-center text-sm text-slate-400">
          Loading product…
        </div>
      ) : query.isError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {extractErrorMessage(query.error, 'Failed to load product')}
        </div>
      ) : query.data ? (
        <article className="grid gap-10 lg:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950">
            <Package className="size-24 text-slate-700" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
                {query.data.isActive ? 'In catalog' : 'Unavailable'}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {query.data.name}
              </h1>
              <p className="text-sm text-slate-400">SKU {query.data.sku}</p>
            </div>

            <p className="text-3xl font-semibold text-white">
              ${currencyFormatter.format(query.data.price)}
            </p>

            {query.data.description ? (
              <p className="text-sm leading-6 text-slate-300">{query.data.description}</p>
            ) : (
              <p className="text-sm leading-6 text-slate-500">
                No description provided for this product.
              </p>
            )}

            <div className="flex items-center gap-3 text-sm">
              <span
                className={[
                  'rounded-full px-3 py-1 text-xs font-medium',
                  query.data.stock === 0
                    ? 'bg-red-500/10 text-red-300'
                    : 'bg-emerald-500/10 text-emerald-300',
                ].join(' ')}
              >
                {query.data.stock === 0 ? 'Sold out' : 'Available'}
              </span>
            </div>

            <button
              type="button"
              disabled={query.data.stock === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              onClick={handleAddToCart}
            >
              {justAdded ? (
                <>
                  <Check className="size-4" />
                  Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" />
                  Add to cart
                </>
              )}
            </button>
          </div>
        </article>
      ) : null}
    </div>
  )
}
