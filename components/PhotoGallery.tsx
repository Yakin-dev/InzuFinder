'use client'

import * as React from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { cn } from '@/lib/utils'

export function PhotoGallery({
  images,
  title,
  className,
}: {
  images: Array<{ url: string }>
  title: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  const slides = images.map((img) => ({ src: img.url }))
  const main = images[0]?.url

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 p-2 bg-white">
        <button
          type="button"
          className="relative aspect-[16/9] lg:col-span-3 overflow-hidden rounded-2xl bg-gray-100"
          onClick={() => {
            if (!main) return
            setIndex(0)
            setOpen(true)
          }}
        >
          {main ? (
            <Image src={main} alt={title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 60vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              No photos yet
            </div>
          )}
        </button>

        <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 lg:col-span-2">
          {images.slice(1, 5).map((img, i) => {
            const realIndex = i + 1
            return (
              <button
                key={`${img.url}-${i}`}
                type="button"
                className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                onClick={() => {
                  setIndex(realIndex)
                  setOpen(true)
                }}
              >
                <Image src={img.url} alt={`${title} ${realIndex + 1}`} fill className="object-cover" sizes="25vw" />
                {i === 3 && images.length > 5 ? (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                    +{images.length - 5}
                  </div>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        on={{ view: ({ index: next }) => setIndex(next) }}
      />
    </div>
  )
}

