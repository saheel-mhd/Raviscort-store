import { Link } from 'react-router-dom'

import { usePageTitle } from '@/hooks/use-page-title'
import { routePaths } from '@/routes/paths'

export default function NotFoundPage() {
  usePageTitle('Not found')

  return (
    <section className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-sky-300">404</p>
      <h1 className="text-3xl font-semibold text-white sm:text-4xl">Page not found</h1>
      <p className="max-w-md text-sm text-slate-400">
        We couldn’t find the page you were looking for. Try browsing the shop instead.
      </p>
      <Link
        to={routePaths.home}
        className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
      >
        Back to home
      </Link>
    </section>
  )
}
