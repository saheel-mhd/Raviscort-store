import { ProductCard } from '@/modules/products/components/product-card'
import type { Product } from '@/modules/products/types/product.types'

type Props = {
  products: Product[]
}

export function ProductsGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
        <p className="text-sm text-slate-400">
          Nothing here yet. Check back soon for new arrivals.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
