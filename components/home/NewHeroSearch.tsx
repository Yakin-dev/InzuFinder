'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlass, CaretDown } from '@phosphor-icons/react'

interface SearchState {
  lookingFor: string
  price: string
  location: string
  bedrooms: string
  query: string
}

const PROPERTY_TYPES = [
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'SHOP', label: 'Shop' },
  { value: 'WAREHOUSE', label: 'Warehouse' },
]

const PRICE_RANGES = [
  { value: '100000', label: 'Under 100k' },
  { value: '200000', label: 'Under 200k' },
  { value: '300000', label: 'Under 300k' },
  { value: '500000', label: 'Under 500k' },
  { value: '1000000', label: '1M+' },
]

const LOCATIONS = [
  { value: 'Gasabo', label: 'Gasabo' },
  { value: 'Kicukiro', label: 'Kicukiro' },
  { value: 'Nyarugenge', label: 'Nyarugenge' },
  { value: 'Kimironko', label: 'Kimironko' },
  { value: 'Kacyiru', label: 'Kacyiru' },
  { value: 'Remera', label: 'Remera' },
  { value: 'Nyamirambo', label: 'Nyamirambo' },
  { value: 'Gikondo', label: 'Gikondo' },
  { value: 'Kacyiru', label: 'Kacyiru' },
  { value: 'Kagarama', label: 'Kagarama' },
]

const BEDROOMS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1 Bed' },
  { value: '2', label: '2 Beds' },
  { value: '3', label: '3 Beds' },
  { value: '4', label: '4+ Beds' },
]

const FILTER_PILLS = [
  { key: 'city', label: 'City', value: 'Gasabo' },
  { key: 'type', label: 'House', value: 'HOUSE' },
  { key: 'category', label: 'Residential', value: 'residential' },
  { key: 'furnished', label: 'Furnished', value: 'true' },
  { key: 'type', label: 'Studio', value: 'STUDIO' },
]

export default function NewHeroSearch() {
  const router = useRouter()
  const [search, setSearch] = useState<SearchState>({
    lookingFor: 'HOUSE',
    price: '',
    location: '',
    bedrooms: '',
    query: '',
  })
  const [activePill, setActivePill] = useState('city')

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    // Add query parameter if exists
    if (search.query.trim()) {
      params.set('q', search.query.trim())
    }
    
    // Add filter parameters
    if (search.lookingFor) {
      params.set('type', search.lookingFor)
    }
    if (search.price) {
      params.set('maxPrice', search.price)
    }
    if (search.location) {
      params.set('district', search.location)
    }
    if (search.bedrooms) {
      params.set('minBedrooms', search.bedrooms)
    }
    
    router.push(`/houses?${params.toString()}`)
  }

  const handlePillClick = (pill: typeof FILTER_PILLS[0]) => {
    setActivePill(pill.key)
    setSearch(prev => ({
      ...prev,
      [pill.key]: pill.value,
      ...(pill.key === 'type' && { lookingFor: pill.value }),
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* White Search Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Find The Best Place</h2>
        
        {/* Free Text Search at Top */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search.query}
              onChange={(e) => setSearch(prev => ({ ...prev, query: e.target.value }))}
              placeholder="Search by location, property name, or keywords..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
            />
          </div>
        </div>

        {/* Horizontal Filter Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Looking For */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
            <div className="relative">
              <select
                value={search.lookingFor}
                onChange={(e) => setSearch(prev => ({ ...prev, lookingFor: e.target.value }))}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <CaretDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Price */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <div className="relative">
              <select
                value={search.price}
                onChange={(e) => setSearch(prev => ({ ...prev, price: e.target.value }))}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
              >
                <option value="">Select price</option>
                {PRICE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>{range.label} in RWF</option>
                ))}
              </select>
              <CaretDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <select
                value={search.location}
                onChange={(e) => setSearch(prev => ({ ...prev, location: e.target.value }))}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
              >
                <option value="">Select location</option>
                {LOCATIONS.map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </select>
              <CaretDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Number of Rooms */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
            <div className="relative">
              <select
                value={search.bedrooms}
                onChange={(e) => setSearch(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
              >
                {BEDROOMS.map(bed => (
                  <option key={bed.value} value={bed.value}>{bed.label}</option>
                ))}
              </select>
              <CaretDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-[#16a34a] hover:bg-[#0d4f2e] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <MagnifyingGlass size={20} />
            Search
          </button>
        </div>
      </div>

      {/* Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-gray-600 font-medium whitespace-nowrap">Filter</span>
        {FILTER_PILLS.map((pill) => (
          <button
            key={pill.key}
            onClick={() => handlePillClick(pill)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              activePill === pill.key
                ? 'bg-[#16a34a] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  )
}
