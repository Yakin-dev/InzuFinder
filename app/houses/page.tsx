'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HouseCard from '@/components/houses/HouseCard'
import { MagnifyingGlass, Funnel, SortAscending, X, MapPin, CaretLeft, CaretRight } from '@phosphor-icons/react'

interface House {
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

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge']
const TYPES = ['HOUSE', 'APARTMENT', 'STUDIO', 'VILLA']
const BEDROOMS = [1, 2, 3, 4, 5]

import { Suspense } from 'react'

function HousesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [houses, setHouses] = useState<House[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileFilters, setMobileFilters] = useState(false)

  const [filters, setFilters] = useState({
    district: searchParams.get('district') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnished: searchParams.get('furnished') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    page: 1,
  })

  const fetchHouses = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, String(v))
    })

    try {
      const res = await fetch(`/api/houses?${params}`)
      const data = await res.json()
      setHouses(data.houses || [])
      setPagination(data.pagination || null)
    } catch {
      setHouses([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchHouses()
  }, [fetchHouses])

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, String(v))
    })
    const url = params.toString() ? `/houses?${params}` : '/houses'
    router.replace(url, { scroll: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.district, filters.type, filters.minPrice, filters.maxPrice, filters.bedrooms, filters.furnished, filters.search, filters.sort])

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ district: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', furnished: '', search: '', sort: '', page: 1 })
    router.push('/houses')
  }

  const hasActiveFilters = filters.district || filters.type || filters.minPrice || filters.maxPrice || filters.bedrooms || filters.furnished

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100 py-6">
          <div className="container-app">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <a href="/" className="hover:text-[#0d4f2e] transition-colors">Home</a>
              <CaretRight size={12} />
              <span className="text-gray-900 font-medium">All Properties</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {filters.district ? `Houses in ${filters.district}` : 'All Rental Properties in Kigali'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {pagination ? `${pagination.total} verified listing${pagination.total !== 1 ? 's' : ''} found` : 'Loading...'}
                </p>
              </div>
              {/* Search bar */}
              <div className="relative max-w-sm w-full">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="form-input pl-10 pr-4 py-2.5 text-sm"
                  id="search-houses"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container-app py-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden btn-secondary mb-4 text-sm flex items-center gap-2"
          >
            <Funnel size={16} />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#16a34a]" />}
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters — Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="card p-5 sticky top-20">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Funnel size={16} weight="duotone" />
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-[#16a34a] hover:underline font-medium">
                      Clear all
                    </button>
                  )}
                </div>

                <FilterContent
                  filters={filters}
                  updateFilter={updateFilter}
                />
              </div>
            </aside>

            {/* Mobile Filters — Bottom Sheet */}
            {mobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilters(false)} />
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="font-bold text-gray-900">Filters</h2>
                    <button onClick={() => setMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-5">
                    <FilterContent filters={filters} updateFilter={updateFilter} />
                    <button onClick={() => setMobileFilters(false)} className="btn-primary w-full mt-6">
                      Show Results
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Listings Grid */}
            <div className="flex-1">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SortAscending size={16} className="text-gray-400" />
                  <select
                    value={filters.sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="text-sm text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer font-medium"
                    id="sort-houses"
                  >
                    <option value="">Featured First</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
                {pagination && (
                  <span className="text-sm text-gray-500">{pagination.total} properties</span>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card overflow-hidden">
                      <div className="aspect-video animate-shimmer" />
                      <div className="p-4 space-y-3">
                        <div className="flex gap-2">
                          <div className="h-5 w-16 animate-shimmer rounded-full" />
                          <div className="h-5 w-14 animate-shimmer rounded-full" />
                        </div>
                        <div className="h-4 animate-shimmer rounded w-3/4" />
                        <div className="h-3 animate-shimmer rounded w-1/2" />
                        <div className="h-3 animate-shimmer rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : houses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {houses.map((house, i) => (
                      <div
                        key={house.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <HouseCard house={house} index={i} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10">
                      <button
                        onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                        disabled={filters.page === 1}
                        className="btn-secondary disabled:opacity-40 px-4 py-2 text-sm flex items-center gap-1"
                      >
                        <CaretLeft size={14} />
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 px-4">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                        disabled={filters.page === pagination.totalPages}
                        className="btn-secondary disabled:opacity-40 px-4 py-2 text-sm flex items-center gap-1"
                      >
                        Next
                        <CaretRight size={14} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MagnifyingGlass size={28} weight="duotone" className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or check back later.</p>
                  <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function HousesPage() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    }>
      <HousesContent />
    </Suspense>
  )
}

/* Filter content — reused between desktop sidebar and mobile bottom sheet */
function FilterContent({
  filters,
  updateFilter,
}: {
  filters: Record<string, string | number>
  updateFilter: (key: string, value: string) => void
}) {
  return (
    <div className="space-y-5">
      {/* District */}
      <div>
        <label className="form-label flex items-center gap-1.5">
          <MapPin size={14} weight="duotone" />
          District
        </label>
        <div className="space-y-2">
          {DISTRICTS.map((d) => (
            <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="district"
                value={d}
                checked={filters.district === d}
                onChange={() => updateFilter('district', filters.district === d ? '' : d)}
                className="w-4 h-4 text-[#0d4f2e] focus:ring-[#16a34a]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#0d4f2e] transition-colors">{d}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="divider !my-0" />

      {/* Property Type */}
      <div>
        <label className="form-label">Property Type</label>
        <select
          value={filters.type as string}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="form-input"
          id="filter-type"
        >
          <option value="">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      <div className="divider !my-0" />

      {/* Price Range */}
      <div>
        <label className="form-label">Price Range (RWF/month)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice as string}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="form-input text-sm"
            id="filter-min-price"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice as string}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="form-input text-sm"
            id="filter-max-price"
          />
        </div>
      </div>

      <div className="divider !my-0" />

      {/* Bedrooms */}
      <div>
        <label className="form-label">Bedrooms</label>
        <div className="flex flex-wrap gap-2">
          {BEDROOMS.map((b) => (
            <button
              key={b}
              onClick={() => updateFilter('bedrooms', filters.bedrooms === String(b) ? '' : String(b))}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                filters.bedrooms === String(b)
                  ? 'bg-[#0d4f2e] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e]'
              }`}
              id={`filter-bed-${b}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="divider !my-0" />

      {/* Furnished toggle */}
      <div>
        <label className="form-label">Furnishing</label>
        <div className="flex gap-2">
          <button
            onClick={() => updateFilter('furnished', filters.furnished === 'true' ? '' : 'true')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              filters.furnished === 'true'
                ? 'bg-[#0d4f2e] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50'
            }`}
          >
            Furnished
          </button>
          <button
            onClick={() => updateFilter('furnished', filters.furnished === 'false' ? '' : 'false')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              filters.furnished === 'false'
                ? 'bg-[#0d4f2e] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50'
            }`}
          >
            Unfurnished
          </button>
        </div>
      </div>
    </div>
  )
}
