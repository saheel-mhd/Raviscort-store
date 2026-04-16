import { Search } from 'lucide-react'

import type {
  ProductListParams,
  ProductSortField,
  SortOrder,
} from '@/modules/products/types/product.types'

type Props = {
  params: ProductListParams
  onChange: (next: Partial<ProductListParams>) => void
}

const sortOptions: { label: string; value: ProductSortField; order: SortOrder }[] = [
  { label: 'Newest', value: 'createdAt', order: 'desc' },
  { label: 'Name A→Z', value: 'name', order: 'asc' },
  { label: 'Price low → high', value: 'price', order: 'asc' },
  { label: 'Price high → low', value: 'price', order: 'desc' },
]

const inputClasses =
  'h-11 rounded-xl border border-white/10 bg-slate-950/60 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none'

export function ProductsToolbar({ params, onChange }: Props) {
  const currentSort = sortOptions.find(
    (option) => option.value === (params.sortBy ?? 'createdAt') && option.order === (params.sortOrder ?? 'desc')
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          className={`${inputClasses} w-full pl-9 pr-3`}
          onChange={(event) => onChange({ search: event.target.value || undefined, page: 1 })}
          placeholder="Search products…"
          type="search"
          value={params.search ?? ''}
        />
      </div>

      <select
        aria-label="Sort"
        className={`${inputClasses} px-3`}
        onChange={(event) => {
          const [sortBy, sortOrder] = event.target.value.split(':') as [ProductSortField, SortOrder]
          onChange({ sortBy, sortOrder, page: 1 })
        }}
        value={`${currentSort?.value ?? 'createdAt'}:${currentSort?.order ?? 'desc'}`}
      >
        {sortOptions.map((option) => (
          <option key={`${option.value}:${option.order}`} value={`${option.value}:${option.order}`}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
