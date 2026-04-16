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
import { PaginationControls } from '@/shared/pagination-controls'

const DEFAULT_LIMIT = 12

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
        <span className="text-xs uppercase tracking-[0.3em] text-sky-300">Catalog</span>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Shop</h1>
        <p className="max-w-xl text-sm text-slate-400">
          Every product is handpicked and kept in stock for fast delivery.
        </p>
      </div>

      <ProductsToolbar params={params} onChange={updateParams} />

      {query.isLoading ? (
        <div className="flex min-h-60 items-center justify-center text-sm text-slate-400">
          Loading products…
        </div>
      ) : query.isError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {extractErrorMessage(query.error, 'Failed to load products')}
        </div>
      ) : query.data ? (
        <div className="flex flex-col gap-8">
          <ProductsGrid products={query.data.products} />
          <PaginationControls
            limit={query.data.pagination.limit}
            onChange={(page) => updateParams({ page })}
            page={query.data.pagination.page}
            total={query.data.pagination.total}
            totalPages={query.data.pagination.totalPages}
          />
        </div>
      ) : null}
    </div>
  )
}
