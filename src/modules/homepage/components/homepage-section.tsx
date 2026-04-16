import { ProductCard } from '@/modules/products/components/product-card'
import type { HomepageSection as HomepageSectionType } from '@/modules/homepage/types/homepage-section.types'

type Props = {
  section: HomepageSectionType
}

export function HomepageSection({ section }: Props) {
  if (section.products.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 text-center">
        <h2 className="font-serif text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
          {section.title}
        </h2>
        {section.description ? (
          <p className="mx-auto max-w-xl text-sm text-neutral-500">{section.description}</p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {section.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
