import { ProductCard } from '@/modules/products/components/product-card'
import type { ShopSection } from '@/modules/shop-layout/types/shop-section.types'

type Props = {
  section: ShopSection
}

const colsClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export function ShopGridRow({ section }: Props) {
  if (section.products.length === 0) return null

  const gridClass = colsClass[section.columns] ?? colsClass[4]

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

      <div className={`grid gap-x-6 gap-y-10 ${gridClass}`}>
        {section.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
