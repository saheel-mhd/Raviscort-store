export function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-3 animate-pulse rounded-full bg-sky-400" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
