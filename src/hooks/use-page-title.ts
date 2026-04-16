import { useEffect } from 'react'

const appName = 'Raviscort'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${appName}` : appName
  }, [title])
}
