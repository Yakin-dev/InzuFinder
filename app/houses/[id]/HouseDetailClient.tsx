'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react'

interface HouseDetailClientProps {
  images: { id: string; url: string }[]
  title: string
  type: string
  furnished: boolean
}

export default function HouseDetailClient({ images, title, type, furnished }: HouseDetailClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const currentImage = images[selectedIndex]?.url

  return (
    <>
      <div className="card overflow-hidden">
        {/* Main Image */}
        <div
          className="aspect-[4/3] sm:aspect-[16/9] relative bg-gray-200 cursor-pointer"
          onClick={() => images.length > 0 && setLightboxOpen(true)}
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
              {type}
            </span>
            {furnished && (
              <span className="bg-[#16a34a]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                Furnished
              </span>
            )}
          </div>

          {/* Image count */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2 p-3 border-t border-gray-100 bg-white">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedIndex(i)}
                className={`aspect-square relative rounded-lg overflow-hidden transition-all ${
                  selectedIndex === i
                    ? 'ring-2 ring-[#16a34a] ring-offset-1'
                    : 'hover:opacity-80'
                }`}
              >
                <Image src={img.url} alt={`View ${i + 1}`} fill className="object-cover" sizes="15vw" />
                {i === 4 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                    +{images.length - 5}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all"
          >
            <X size={28} />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-4 p-3 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all"
              >
                <CaretLeft size={28} />
              </button>
              <button
                onClick={() => setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 p-3 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all"
              >
                <CaretRight size={28} />
              </button>
            </>
          )}

          {/* Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[85vh] m-8">
            <Image
              src={currentImage}
              alt={title}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
