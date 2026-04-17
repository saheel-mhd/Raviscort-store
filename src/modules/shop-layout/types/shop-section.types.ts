import type { Product } from '@/modules/products/types/product.types'

export type ShopRowType = 'featured' | 'grid' | 'carousel' | 'banner'

export type ShopBannerConfig = {
  backgroundImage?: string
  backgroundColor?: string
  textColor?: string
  height?: number
  contentAlign?: 'left' | 'center' | 'right'
  ctaLabel?: string
  ctaHref?: string
}

export type ShopSection = {
  id: string
  title: string
  description: string | null
  type: ShopRowType
  columns: number
  productIds: string[]
  bannerConfig: ShopBannerConfig | null
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  products: Product[]
}

export type ActiveShopSectionsResponse = {
  sections: ShopSection[]
}
