'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bathtub, Heart, Ruler, SquaresFour } from '@phosphor-icons/react'
import { useCompareStore } from '@/hooks/useCompare'
import { useSavedPropertiesStore } from '@/hooks/useSavedProperties'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

interface HouseCardProps {
  house: {
    id: string
    title: string
    price: number
    location: string
    district: string
    type: string
    bedrooms: number
    bathrooms: number
    size?: number | null
    furnished: boolean
    status: string
    isFeatured?: boolean
    images: { url: string }[]
    landlord: { name: string; isVerified: boolean }
  }
  showStatus?: boolean
  index?: number
}

export default function HouseCard({ house, showStatus = false, index = 0 }: HouseCardProps) {
  const image = house.images[0]?.url || null
  const savedStore = useSavedPropertiesStore()
  const { ids: compareIds, toggle } = useCompareStore()
  const isCompared = compareIds.includes(house.id)

  useEffect(() => {
    void savedStore.load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isSaved = savedStore.isSaved(house.id)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    void savedStore.toggle(house.id)
  }

  const typeLabel = house.type.charAt(0) + house.type.slice(1).toLowerCase()

  return (
    <Link href={`/houses/${house.id}`} className="group block rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-green-200" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={house.title}
            fill
            className="house-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-50 to-emerald-100">
            <Bed size={40} weight="duotone" className="text-gray-300" />
            <span className="text-xs text-gray-400 font-medium">No photo yet</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full font-bold text-[#0d4f2e] text-sm shadow-sm">
          {house.price.toLocaleString()} RWF/mo
        </div>

        {/* Featured ribbon */}
        {house.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge variant="featured" withIcon className="shadow-sm">
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="verified" withIcon>
            Verified
          </Badge>
        </div>

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm"
          aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            size={16}
            weight={isSaved ? 'fill' : 'regular'}
            className={isSaved ? 'text-red-500' : 'text-gray-500'}
          />
        </button>

        {/* Status badge for dashboard/admin */}
        {showStatus && (
          <div className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
            house.status === 'APPROVED'
              ? 'bg-green-500 text-white'
              : house.status === 'REJECTED'
              ? 'bg-red-500 text-white'
              : 'bg-yellow-500 text-white'
          }`}>
            {house.status}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mb-2">{typeLabel}</div>
        <h3 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">{house.title}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3"><MapPin size={14} weight="regular" className="text-[#16a34a]" />{house.location}</div>
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1"><Bed size={14} weight="regular" /><span>{house.bedrooms} beds</span></div>
          <div className="flex items-center gap-1"><Bathtub size={14} weight="regular" /><span>{house.bathrooms} baths</span></div>
          <div className="flex items-center gap-1"><Ruler size={14} weight="regular" /><span>{house.size ? `${house.size}m²` : 'N/A'}</span></div>
        </div>
        <div className="divider !my-3" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Avatar name={house.landlord.name} size={20} />
            <span className="text-xs text-gray-500 truncate max-w-[100px]">{house.landlord.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggle(house.id)
              }}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors ${
                isCompared
                  ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#0d4f2e]'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:text-[#0d4f2e]'
              }`}
              aria-pressed={isCompared}
            >
              <SquaresFour size={14} weight="duotone" />
              {isCompared ? 'Selected' : 'Compare'}
            </button>
            <span className="btn-secondary !px-3 !py-1.5 !text-xs">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
