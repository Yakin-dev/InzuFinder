'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bathtub, ShieldCheck, Heart, Star } from '@phosphor-icons/react'

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
  const [isSaved, setIsSaved] = useState(false)

  // Check if this house is in favorites
  useEffect(() => {
    const saved = localStorage.getItem('inzu_favorites')
    if (saved) {
      try {
        const arr = JSON.parse(saved)
        setIsSaved(arr.includes(house.id))
      } catch { /* ignore */ }
    }
  }, [house.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const saved = localStorage.getItem('inzu_favorites')
    let arr: string[] = []
    if (saved) {
      try { arr = JSON.parse(saved) } catch { arr = [] }
    }

    if (arr.includes(house.id)) {
      arr = arr.filter(id => id !== house.id)
      setIsSaved(false)
    } else {
      arr.push(house.id)
      setIsSaved(true)
    }
    localStorage.setItem('inzu_favorites', JSON.stringify(arr))
  }

  const typeLabel = house.type.charAt(0) + house.type.slice(1).toLowerCase()

  return (
    <Link
      href={`/houses/${house.id}`}
      className="card group block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
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

        {/* Price overlay */}
        <div className="price-tag">
          {house.price.toLocaleString()} RWF
          <span className="text-gray-500 font-normal text-xs">/mo</span>
        </div>

        {/* Featured ribbon */}
        {house.isFeatured && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Star size={12} weight="fill" />
            Featured
          </div>
        )}

        {/* Furnished badge */}
        {house.furnished && (
          <div className="absolute top-3 right-12 bg-[#16a34a] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Furnished
          </div>
        )}

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
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#0d4f2e]/10 text-[#0d4f2e]">
            {house.district}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {typeLabel}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-[#0d4f2e] transition-colors mb-2">
          {house.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin size={14} weight="fill" className="text-[#16a34a]" />
          <span>{house.location}, {house.district}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed size={14} weight="duotone" />
            <span>{house.bedrooms} bed{house.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1">
            <Bathtub size={14} weight="duotone" />
            <span>{house.bathrooms} bath{house.bathrooms !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Landlord row */}
        <div className="divider !my-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] rounded-full flex items-center justify-center text-xs font-bold text-white">
              {house.landlord.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[100px]">{house.landlord.name}</span>
          </div>
          {house.landlord.isVerified && (
            <div className="badge-verified text-xs">
              <ShieldCheck size={12} weight="fill" />
              Verified
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
