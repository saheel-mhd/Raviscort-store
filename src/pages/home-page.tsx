import { Link } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import { SectionRenderer } from '@/modules/homepage/components/section-renderer'
import { useActiveHomepageSections } from '@/modules/homepage/hooks/use-active-sections'
import { routePaths } from '@/routes/paths'

export default function HomePage() {
  usePageTitle()

  const sectionsQuery = useActiveHomepageSections()
  const sections = sectionsQuery.data?.sections ?? []

  if (sectionsQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
        Loading…
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
          Nothing yet
        </p>
        <p className="max-w-md text-sm text-neutral-500">
          New collections are on their way. In the meantime, browse the shop.
        </p>
        <Link
          to={routePaths.products}
          className="mt-2 inline-flex items-center bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
        >
          Browse the shop
        </Link>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-20 py-12">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  )
}
