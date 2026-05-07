'use client'

import * as React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { MapPin } from '@phosphor-icons/react'
import { cn, formatRWF } from '@/lib/utils'

const markerIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 256 256%22%3E%3Cpath fill=%22%2316a34a%22 d=%22M128 16a80.1 80.1 0 0 0-80 80c0 74.2 74.2 135.3 77.3 137.9a4 4 0 0 0 5.4 0C133.8 231.3 208 170.2 208 96a80.1 80.1 0 0 0-80-80Zm0 120a40 40 0 1 1 40-40a40 40 0 0 1-40 40Z%22/%3E%3C/svg%3E',
  iconSize: [30, 30],
  iconAnchor: [15, 28],
  popupAnchor: [0, -24],
})

export function MapView({
  houses,
  className,
}: {
  houses: Array<{
    id: string
    title: string
    price: number
    lat?: number | null
    lng?: number | null
  }>
  className?: string
}) {
  const points = houses.filter((h) => typeof h.lat === 'number' && typeof h.lng === 'number')
  const center = points[0] ? ([points[0].lat!, points[0].lng!] as const) : ([-1.9441, 30.0619] as const)

  return (
    <div className={cn('card overflow-hidden', className)}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className="h-[70vh] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((h) => (
          <Marker key={h.id} position={[h.lat!, h.lng!]} icon={markerIcon}>
            <Popup>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900">{h.title}</div>
                <div className="text-sm text-[#0d4f2e] font-bold">{formatRWF(h.price)}/mo</div>
                <Link href={`/houses/${h.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#16a34a] hover:underline">
                  <MapPin size={14} />
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

