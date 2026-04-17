import { ProductCard } from '@/modules/products/components/product-card'
import type { ShopSection } from '@/modules/shop-layout/types/shop-section.types'

type Props = {
  section: ShopSection
}

export function ShopCarouselRow({ section }: Props) {
  if (section.products.length === 0) return null

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

      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
          {section.products.map((product) => (
            <div key={product.id} className="w-56 shrink-0 sm:w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
