import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import { routePaths } from '@/routes/paths'

export default function HomePage() {
  usePageTitle()

  return (
    <section className="flex flex-col items-center gap-8 py-16 text-center">
      <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-sky-200">
        New season
      </span>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Thoughtfully curated essentials, delivered to your door.
      </h1>
      <p className="max-w-xl text-base leading-7 text-slate-300">
        Browse our full catalog and find the product that fits your story.
      </p>
      <Link
        to={routePaths.products}
        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
      >
        Browse the shop
        <ArrowRight className="size-4" />
      </Link>
    </section>
  )
}
