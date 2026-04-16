export function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-2 animate-pulse rounded-full bg-neutral-900" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
