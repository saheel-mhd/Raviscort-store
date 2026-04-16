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
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
  const outOfStock = totalStock === 0

  return (
    <Link
      to={productPath(product.id)}
      className="group flex flex-col gap-3 text-neutral-900"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.cardImage ? (
          <img
            alt={product.name}
            className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            src={product.cardImage}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Package className="size-10 text-neutral-300 transition group-hover:text-neutral-400" strokeWidth={1} />
          </div>
        )}
        {outOfStock ? (
          <span className="absolute left-3 top-3 bg-white/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-900">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-neutral-900 group-hover:underline">
          {product.name}
        </h3>
        <p className="text-sm text-neutral-600">${currencyFormatter.format(product.price)}</p>
      </div>
    </Link>
  )
}
