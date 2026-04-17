import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { ProductCard } from '@/modules/products/components/product-card'
import { ProductsGrid } from '@/modules/products/components/products-grid'
import { ProductsToolbar } from '@/modules/products/components/products-toolbar'
import { useProducts } from '@/modules/products/hooks/use-products'
import type {
  Product,
  ProductListParams,
  ProductSortField,
  SortOrder,
} from '@/modules/products/types/product.types'
import { ShopSectionRenderer } from '@/modules/shop-layout/components/shop-section-renderer'
import { useActiveShopSections } from '@/modules/shop-layout/hooks/use-active-shop-sections'
import { PaginationControls } from '@/shared/pagination-controls'

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

  const isSearching = Boolean(params.search?.trim())

  const productsQuery = useProducts(params)
  const sectionsQuery = useActiveShopSections()

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

  const sections = sectionsQuery.data?.sections ?? []
  const pagination = productsQuery.data?.pagination

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

      {isSearching ? (
        <SearchResultsView
          isLoading={productsQuery.isLoading}
          isError={productsQuery.isError}
          error={productsQuery.error}
          products={productsQuery.data?.products}
        />
      ) : sectionsQuery.isLoading ? (
        <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
          Loading…
        </div>
      ) : sectionsQuery.isError ? (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {extractErrorMessage(sectionsQuery.error, 'Failed to load shop layout')}
        </div>
      ) : sections.length > 0 ? (
        <div className="flex flex-col gap-20">
          {sections.map((section) => (
            <ShopSectionRenderer key={section.id} section={section} />
          ))}
        </div>
      ) : (
        <DefaultProductsView
          isLoading={productsQuery.isLoading}
          isError={productsQuery.isError}
          error={productsQuery.error}
          products={productsQuery.data?.products}
        />
      )}

      {(isSearching || sections.length === 0) && pagination && pagination.totalPages > 1 ? (
        <PaginationControls
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onChange={(page) => updateParams({ page })}
        />
      ) : null}
    </div>
  )
}

type ViewProps = {
  isLoading: boolean
  isError: boolean
  error: Error | null
  products: Product[] | undefined
}

function SearchResultsView({ isLoading, isError, error, products }: ViewProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
        Searching…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {extractErrorMessage(error, 'Failed to search products')}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-60 items-center justify-center border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
        <p className="text-sm text-neutral-500">No products match your search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function DefaultProductsView({ isLoading, isError, error, products }: ViewProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
        Loading products…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {extractErrorMessage(error, 'Failed to load products')}
      </div>
    )
  }

  if (products) {
    return <ProductsGrid products={products} />
  }

  return null
}
