import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Product } from '@/modules/products/types/product.types'
import { productPath } from '@/routes/paths'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const outOfStock = product.stock === 0

  return (
    <Link
      to={productPath(product.id)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 transition hover:border-white/20 hover:bg-slate-950/80"
    >
      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <Package className="size-10 text-slate-700 transition group-hover:text-slate-500" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold text-white">{product.name}</h3>
        <p className="text-xs text-slate-500">SKU {product.sku}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-base font-semibold text-white">
            ${currencyFormatter.format(product.price)}
          </span>
          {outOfStock ? (
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-300">
              Sold out
            </span>
          ) : (
            <span className="text-xs text-slate-400">In stock</span>
          )}
        </div>
      </div>
    </Link>
  )
}
