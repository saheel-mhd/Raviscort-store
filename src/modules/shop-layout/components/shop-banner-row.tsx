import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import type { ShopSection } from '@/modules/shop-layout/types/shop-section.types'

type Props = {
  section: ShopSection
}

export function ShopBannerRow({ section }: Props) {
  const config = section.bannerConfig
  if (!config) return null

  const textColor = config.textColor ?? '#ffffff'
  const contentAlign = config.contentAlign ?? 'center'
  const height = config.height ?? 400

  const containerStyle: CSSProperties = {
    minHeight: height,
    color: textColor,
    backgroundColor: config.backgroundColor,
    backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const contentAlignClass =
    contentAlign === 'left'
      ? 'items-start text-left'
      : contentAlign === 'right'
        ? 'items-end text-right'
        : 'items-center text-center'

  return (
    <section
      className="relative -mx-4 flex items-center overflow-hidden px-4 py-12 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      style={containerStyle}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl flex-col gap-4 ${contentAlignClass}`}
        style={{ minHeight: Math.max(height - 96, 160) }}
      >
        <h2
          className="font-serif text-3xl font-normal tracking-tight sm:text-5xl"
          style={{ color: textColor }}
        >
          {section.title}
        </h2>
        {section.description ? (
          <p className="max-w-xl text-base leading-7 opacity-90" style={{ color: textColor }}>
            {section.description}
          </p>
        ) : null}
        {config.ctaLabel && config.ctaHref ? (
          <Link
            className="mt-2 inline-flex items-center bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-neutral-800"
            to={config.ctaHref}
          >
            {config.ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
