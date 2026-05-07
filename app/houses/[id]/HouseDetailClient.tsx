'use client'

import { PhotoGallery } from '@/components/PhotoGallery'

interface HouseDetailClientProps {
  images: { id: string; url: string }[]
  title: string
  type: string
  furnished: boolean
}

export default function HouseDetailClient({ images, title, type, furnished }: HouseDetailClientProps) {
  return (
    <>
      <div className="space-y-3">
        <div className="flex gap-2">
          <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-100">
            {type}
          </span>
          {furnished ? (
            <span className="bg-[#16a34a] px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
              Furnished
            </span>
          ) : null}
        </div>
        <PhotoGallery images={images} title={title} />
      </div>
    </>
  )
}
