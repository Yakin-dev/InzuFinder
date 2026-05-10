'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'

const PROPERTY_TYPES = [
  { value: '', label: 'Any Type' },
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'SHOP', label: 'Shop' },
  { value: 'WAREHOUSE', label: 'Warehouse' },
]

const LOCATIONS = [
  { value: '', label: 'Any Location' },
  { value: 'Gasabo', label: 'Gasabo' },
  { value: 'Kicukiro', label: 'Kicukiro' },
  { value: 'Nyarugenge', label: 'Nyarugenge' },
]

const CHIPS = [
  { label: 'Gasabo', href: '/houses?district=Gasabo' },
  { label: 'Kicukiro', href: '/houses?district=Kicukiro' },
  { label: 'Nyarugenge', href: '/houses?district=Nyarugenge' },
  { label: 'Furnished', href: '/houses?furnished=true' },
  { label: 'Studio', href: '/houses?type=STUDIO' },
]

export default function NewHeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [location, setLocation] = useState('')
  const [activeChip, setActiveChip] = useState<string | null>(null)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (type) params.set('type', type)
    if (location) params.set('district', location)
    router.push(`/houses?${params.toString()}`)
  }

  const handleChip = (chip: (typeof CHIPS)[0]) => {
    setActiveChip(chip.label)
    if (chip.label === 'Gasabo' || chip.label === 'Kicukiro' || chip.label === 'Nyarugenge') {
      setLocation(chip.label)
    }
    if (chip.label === 'Studio') setType('STUDIO')
    if (chip.label === 'Furnished') {
      router.push(chip.href)
      return
    }
  }

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {/* Glass Search Card */}
      <div
        className="relative rounded-2xl p-4 md:p-5"
        style={{
          background: 'rgba(3, 20, 11, 0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(74, 222, 128, 0.28)',
          boxShadow:
            '0 0 0 1px rgba(74,222,128,0.08), 0 0 32px rgba(34,197,94,0.22), 0 18px 70px rgba(0,0,0,0.35)',
        }}
      >
        {/* Title */}
        <p className="text-green-300/80 text-xs font-semibold uppercase tracking-wider mb-3">
          Find verified rentals faster
        </p>

        {/* Search Row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Text input */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-300/60"
              strokeWidth={2.5}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search location, property name, or keyword…"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/50 transition-all"
            />
          </div>

          {/* Property type */}
          <div className="relative md:w-40">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-11 pl-3 pr-8 rounded-xl bg-white/10 border border-white/15 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 cursor-pointer"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="text-gray-900">
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>

          {/* Location */}
          <div className="relative md:w-40">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 pl-3 pr-8 rounded-xl bg-white/10 border border-white/15 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 cursor-pointer"
            >
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value} className="text-gray-900">
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="h-11 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              boxShadow: '0 0 16px rgba(34,197,94,0.35), 0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <Search size={16} strokeWidth={2.5} />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleChip(chip)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 backdrop-blur-sm ${
              activeChip === chip.label
                ? 'bg-[#22c55e]/90 text-white shadow-md'
                : 'bg-white/10 text-white/70 border border-white/15 hover:bg-white/20 hover:text-white'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
