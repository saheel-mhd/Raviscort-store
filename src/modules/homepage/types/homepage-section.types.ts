import type { Product } from '@/modules/products/types/product.types'

export type SectionType = 'product' | 'banner'
export type BannerAlignment = 'left' | 'center' | 'right'

export type BannerConfig = {
  image?: string
  imagePosition?: BannerAlignment
  backgroundImage?: string
  backgroundColor?: string
  textColor?: string
  height?: number
  contentAlign?: BannerAlignment
  ctaLabel?: string
  ctaHref?: string
}

export type HomepageSection = {
  id: string
  title: string
  description: string | null
  type: SectionType
  productIds: string[]
  bannerConfig: BannerConfig | null
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  products: Product[]
}

export type ActiveHomepageSectionsResponse = {
  sections: HomepageSection[]
}
