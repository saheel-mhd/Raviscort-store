import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import type { HomepageSection } from '@/modules/homepage/types/homepage-section.types'

type Props = {
  section: HomepageSection
}

export function BannerSection({ section }: Props) {
  const config = section.bannerConfig
  if (!config) return null

  const textColor = config.textColor ?? '#ffffff'
  const contentAlign = config.contentAlign ?? 'center'
  const imagePosition = config.imagePosition ?? 'center'
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

  const layoutDirection =
    imagePosition === 'left'
      ? 'flex-col gap-10 md:flex-row'
      : imagePosition === 'right'
        ? 'flex-col-reverse gap-10 md:flex-row-reverse'
        : 'flex-col gap-8'

  return (
    <section
      className="relative -mx-4 overflow-hidden px-4 py-12 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      style={containerStyle}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center ${layoutDirection}`}
        style={{ minHeight: Math.max(height - 96, 160) }}
      >
        {config.image && imagePosition !== 'center' ? (
          <div className="flex w-full justify-center md:flex-1">
            <img
              alt=""
              className="max-h-[70vh] w-full max-w-md object-contain"
              loading="lazy"
              src={config.image}
            />
          </div>
        ) : null}

        <div className={`flex flex-1 flex-col gap-4 ${contentAlignClass}`}>
          {config.image && imagePosition === 'center' ? (
            <img
              alt=""
              className="max-h-60 w-full max-w-md object-contain"
              loading="lazy"
              src={config.image}
            />
          ) : null}

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
      </div>
    </section>
  )
}
