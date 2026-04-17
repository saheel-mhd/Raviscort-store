import { ShopBannerRow } from '@/modules/shop-layout/components/shop-banner-row'
import { ShopCarouselRow } from '@/modules/shop-layout/components/shop-carousel-row'
import { ShopFeaturedRow } from '@/modules/shop-layout/components/shop-featured-row'
import { ShopGridRow } from '@/modules/shop-layout/components/shop-grid-row'
import type { ShopSection } from '@/modules/shop-layout/types/shop-section.types'

type Props = {
  section: ShopSection
}

export function ShopSectionRenderer({ section }: Props) {
  switch (section.type) {
    case 'banner':
      return <ShopBannerRow section={section} />
    case 'featured':
      return <ShopFeaturedRow section={section} />
    case 'carousel':
      return <ShopCarouselRow section={section} />
    case 'grid':
    default:
      return <ShopGridRow section={section} />
  }
}
