import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Product } from '@/modules/products/types/product.types'
import type { ShopSection } from '@/modules/shop-layout/types/shop-section.types'
import { productPath } from '@/routes/paths'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

type Props = {
  section: ShopSection
}

export function ShopFeaturedRow({ section }: Props) {
  if (section.products.length === 0) return null

  const columns = Math.min(section.columns || 2, section.products.length)

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="font-serif text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
          {section.title}
        </h2>
        {section.description ? (
          <p className="max-w-xl text-sm text-neutral-500">{section.description}</p>
        ) : null}
      </header>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {section.products.slice(0, columns).map((product) => (
          <FeaturedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function FeaturedCard({ product }: { product: Product }) {
  const totalStock = (product.variants ?? []).reduce((sum, v) => sum + v.stock, 0)
  const outOfStock = totalStock === 0

  return (
    <Link
      to={productPath(product.id)}
      className="group relative flex flex-col gap-4 text-neutral-900"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {product.cardImage ? (
          <img
            alt={product.name}
            className="size-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
            src={product.cardImage}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Package className="size-16 text-neutral-300" strokeWidth={1} />
          </div>
        )}
        {outOfStock ? (
          <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-neutral-900">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium text-neutral-900 group-hover:underline">
          {product.name}
        </h3>
        <p className="text-base text-neutral-600">${currencyFormatter.format(product.price)}</p>
      </div>
    </Link>
  )
}
