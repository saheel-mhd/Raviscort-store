import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { ProductsGrid } from '@/modules/products/components/products-grid'
import { ProductsToolbar } from '@/modules/products/components/products-toolbar'
import { useProducts } from '@/modules/products/hooks/use-products'
import type {
  ProductListParams,
  ProductSortField,
  SortOrder,
} from '@/modules/products/types/product.types'
const DEFAULT_LIMIT = 24

function parseParams(searchParams: URLSearchParams): ProductListParams {
  const page = Number(searchParams.get('page') ?? '1') || 1
  const limit = Number(searchParams.get('limit') ?? String(DEFAULT_LIMIT)) || DEFAULT_LIMIT
  const search = searchParams.get('search') ?? undefined
  const sortBy = (searchParams.get('sortBy') as ProductSortField | null) ?? 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') as SortOrder | null) ?? 'desc'

  return { page, limit, search, sortBy, sortOrder }
}

export default function ProductsListPage() {
  usePageTitle('Shop')

  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(() => parseParams(searchParams), [searchParams])

  const query = useProducts(params)

  const updateParams = (next: Partial<ProductListParams>) => {
    setSearchParams(
      (prev) => {
        const merged = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(next)) {
          if (value === undefined || value === null || value === '') {
            merged.delete(key)
          } else {
            merged.set(key, String(value))
          }
        }
        return merged
      },
      { replace: true }
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.4em] text-neutral-500">Catalog</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">Shop</h1>
        <p className="max-w-xl text-sm text-neutral-500">
          Every product is handpicked and kept in stock for fast delivery.
        </p>
      </div>

      <ProductsToolbar params={params} onChange={updateParams} />

      {query.isLoading ? (
        <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
          Loading products…
        </div>
      ) : query.isError ? (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {extractErrorMessage(query.error, 'Failed to load products')}
        </div>
      ) : query.data ? (
        <div className="flex flex-col gap-8">
          <ProductsGrid products={query.data.products} />
        </div>
      ) : null}
    </div>
  )
}
