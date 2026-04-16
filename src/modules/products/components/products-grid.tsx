import { ProductCard } from '@/modules/products/components/product-card'
import type { Product } from '@/modules/products/types/product.types'

type Props = {
  products: Product[]
}

export function ProductsGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-60 items-center justify-center border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
        <p className="text-sm text-neutral-500">
          Nothing here yet. Check back soon for new arrivals.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
