import { BannerSection } from '@/modules/homepage/components/banner-section'
import { HomepageSection } from '@/modules/homepage/components/homepage-section'
import type { HomepageSection as HomepageSectionType } from '@/modules/homepage/types/homepage-section.types'

type Props = {
  section: HomepageSectionType
}

export function SectionRenderer({ section }: Props) {
  if (section.type === 'banner') {
    return <BannerSection section={section} />
  }

  return <HomepageSection section={section} />
}
