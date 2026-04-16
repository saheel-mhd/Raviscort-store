import { useMemo, useState } from 'react'
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { extractErrorMessage } from '@/api/client'
import { usePageTitle } from '@/hooks/use-page-title'
import { useCartActions, useCartItems } from '@/modules/cart/hooks/use-cart'
import { useProduct } from '@/modules/products/hooks/use-product'
import type { ProductVariant } from '@/modules/products/types/product.types'
import { routePaths } from '@/routes/paths'

const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function ProductDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const query = useProduct(id)
  const { addItem } = useCartActions()
  const cartItems = useCartItems()
  const navigate = useNavigate()
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  usePageTitle(query.data?.name)

  const variants = query.data?.variants ?? []
  const totalStock = useMemo(
    () => variants.reduce((sum, v) => sum + v.stock, 0),
    [variants],
  )

  if (!id) {
    return <Navigate replace to={routePaths.products} />
  }

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null
  const inCart = selectedVariant
    ? cartItems.some((item) => item.productVariantId === selectedVariant.id)
    : false

  const handleAddToCart = () => {
    if (!query.data) return
    if (!selectedVariant) {
      setSizeError('Please choose a size first.')
      return
    }
    setSizeError(null)
    addItem({
      productVariantId: selectedVariant.id,
      productId: query.data.id,
      name: query.data.name,
      slug: query.data.slug,
      sku: query.data.sku,
      price: query.data.price,
      maxStock: selectedVariant.stock,
      sizeName: selectedVariant.unit.name,
      sizeShortName: selectedVariant.unit.shortName,
      unitCategoryName: selectedVariant.unit.category.name,
      cardImage: query.data.cardImage,
      quantity: 1,
    })
  }

  const handleButtonClick = () => {
    if (inCart) {
      navigate(routePaths.cart)
      return
    }
    handleAddToCart()
  }

  const handleSelectVariant = (variantId: string) => {
    setSelectedVariantId(variantId)
    setSizeError(null)
  }

  const noStockForSelected = selectedVariant ? selectedVariant.stock === 0 : false

  return (
    <div className="flex flex-col gap-8">
      <Link
        to={routePaths.products}
        className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Back to shop
      </Link>

      {query.isLoading ? (
        <div className="flex min-h-60 items-center justify-center text-sm text-neutral-500">
          Loading product…
        </div>
      ) : query.isError ? (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {extractErrorMessage(query.error, 'Failed to load product')}
        </div>
      ) : query.data ? (
        <article className="grid gap-12 lg:grid-cols-2">
          <ProductGallery
            activeImage={activeImage ?? query.data.mainImage}
            galleryImages={query.data.galleryImages}
            mainImage={query.data.mainImage}
            onSelect={setActiveImage}
          />

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
                {query.data.isActive ? 'In catalog' : 'Unavailable'}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {query.data.name}
              </h1>
              <p className="text-sm text-neutral-500">SKU {query.data.sku}</p>
            </div>

            <p className="text-2xl font-medium text-neutral-900">
              ${currencyFormatter.format(query.data.price)}
            </p>

            {query.data.description ? (
              <p className="text-sm leading-7 text-neutral-700">{query.data.description}</p>
            ) : (
              <p className="text-sm leading-7 text-neutral-400">
                No description provided for this product.
              </p>
            )}

            <SizePicker
              variants={variants}
              selectedId={selectedVariantId}
              onSelect={handleSelectVariant}
            />

            {sizeError ? (
              <p className="text-xs font-medium text-red-600">{sizeError}</p>
            ) : null}

            <div className="flex items-center gap-3 text-sm">
              <span
                className={[
                  'inline-flex items-center px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]',
                  totalStock === 0
                    ? 'bg-neutral-100 text-neutral-500'
                    : 'bg-neutral-900 text-white',
                ].join(' ')}
              >
                {totalStock === 0 ? 'Sold out' : 'Available'}
              </span>
            </div>

            <button
              type="button"
              disabled={totalStock === 0 || noStockForSelected}
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
              onClick={handleButtonClick}
            >
              <ShoppingBag className="size-4" strokeWidth={1.5} />
              {inCart ? 'View cart' : 'Add to cart'}
            </button>
          </div>
        </article>
      ) : null}
    </div>
  )
}

type SizePickerProps = {
  variants: ProductVariant[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function SizePicker({ variants, selectedId, onSelect }: SizePickerProps) {
  if (variants.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Size</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isActive = variant.id === selectedId
          const soldOut = variant.stock === 0
          return (
            <button
              key={variant.id}
              className={[
                'min-w-14 border px-4 py-2 text-sm font-medium tracking-wide transition',
                soldOut
                  ? 'cursor-not-allowed border-neutral-200 text-neutral-300 line-through'
                  : isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-900 hover:border-neutral-900',
              ].join(' ')}
              disabled={soldOut}
              onClick={() => onSelect(variant.id)}
              title={variant.unit.name}
              type="button"
            >
              {variant.unit.shortName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

type GalleryProps = {
  activeImage: string | null
  galleryImages: string[]
  mainImage: string | null
  onSelect: (url: string | null) => void
}

function ProductGallery({ activeImage, galleryImages, mainImage, onSelect }: GalleryProps) {
  const thumbnails = [mainImage, ...galleryImages].filter((url): url is string => !!url)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-neutral-100">
        {activeImage ? (
          <img alt="" className="size-full object-cover" src={activeImage} />
        ) : (
          <Package className="size-24 text-neutral-300" strokeWidth={1} />
        )}
      </div>

      {thumbnails.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {thumbnails.map((url) => {
            const isActive = url === activeImage
            return (
              <button
                aria-label="Show image"
                className={`size-20 shrink-0 overflow-hidden border transition ${
                  isActive
                    ? 'border-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
                key={url}
                onClick={() => onSelect(url === mainImage ? null : url)}
                type="button"
              >
                <img alt="" className="size-full object-cover" src={url} />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
