'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HouseCard from '@/components/houses/HouseCard'
import { HouseCardSkeleton } from '@/components/HouseCardSkeleton'
import dynamic from 'next/dynamic'
import { MagnifyingGlass, Funnel, SortAscending, X, MapPin, CaretLeft, CaretRight, SlidersHorizontal, MapTrifold, SquaresFour } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCompareStore } from '@/hooks/useCompare'

const MapView = dynamic(() => import('@/components/MapView').then((m) => m.MapView), { ssr: false })

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
  size?: number | null
  isFeatured?: boolean
  lat?: number | null
  lng?: number | null
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
const TYPES = ['HOUSE', 'APARTMENT', 'STUDIO', 'ROOM', 'VILLA', 'SHOP', 'OFFICE', 'WAREHOUSE', 'HALL', 'RESTAURANT']
const BEDROOMS = [1, 2, 3, 4, 5]

export default function HousesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [houses, setHouses] = useState<House[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const { ids: compareIds, clear: clearCompare } = useCompareStore()

  const [filters, setFilters] = useState({
    district: searchParams.get('district') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnished: searchParams.get('furnished') || '',
    hasParking: searchParams.get('hasParking') || '',
    nearMainRoad: searchParams.get('nearMainRoad') || '',
    footTraffic: searchParams.get('footTraffic') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    page: Number(searchParams.get('page') || '1'),
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
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchHouses()
  }, [fetchHouses])

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, String(v))
    })
    const url = params.toString() ? `/houses?${params}` : '/houses'
    router.replace(url, { scroll: false })
  }, [filters, router])

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      district: '',
      type: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      furnished: '',
      hasParking: '',
      nearMainRoad: '',
      footTraffic: '',
      search: '',
      sort: '',
      page: 1,
    })
    router.push('/houses')
  }

  const hasActiveFilters =
    filters.district ||
    filters.type ||
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.bedrooms ||
    filters.furnished ||
    filters.hasParking ||
    filters.nearMainRoad ||
    filters.footTraffic ||
    filters.search

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-white border-b border-gray-100 py-6">
          <div className="container-app">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <a href="/" className="hover:text-[#0d4f2e] transition-colors">Home</a>
              <CaretRight size={12} />
              <span className="text-gray-900 font-medium">All Properties</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {filters.district ? `Houses in ${filters.district}` : 'All Rental Properties in Kigali'}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {pagination ? `${pagination.total} verified listing${pagination.total !== 1 ? 's' : ''} found` : 'Loading...'}
                </p>
              </div>
              <div className="relative max-w-sm w-full">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" weight="regular" />
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
          <button onClick={() => setMobileFilters(true)} className="lg:hidden btn-secondary mb-4 text-sm flex items-center gap-2">
            <SlidersHorizontal size={16} weight="regular" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#16a34a]" />}
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="card p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Funnel size={16} weight="duotone" />
                    Filters
                  </h2>
                  {hasActiveFilters && <button onClick={clearFilters} className="text-xs text-[#16a34a] hover:underline font-medium">Clear all</button>}
                </div>
                <FilterContent filters={filters} updateFilter={updateFilter} />
              </div>
            </aside>

            {mobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilters(false)} />
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl h-[80vh] overflow-y-auto">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="font-bold text-gray-900">Filters</h2>
                    <button onClick={() => setMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                  </div>
                  <div className="p-5">
                    <FilterContent filters={filters} updateFilter={updateFilter} />
                    <button onClick={() => setMobileFilters(false)} className="btn-primary w-full mt-6">Show Results</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SortAscending size={16} className="text-gray-400" weight="regular" />
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`btn-secondary !px-3 !py-2 text-sm flex items-center gap-2 ${viewMode === 'grid' ? 'border-green-200 text-[#0d4f2e]' : ''}`}
                >
                  <SquaresFour size={16} />
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`btn-secondary !px-3 !py-2 text-sm flex items-center gap-2 ${viewMode === 'map' ? 'border-green-200 text-[#0d4f2e]' : ''}`}
                >
                  <MapTrifold size={16} />
                  Map
                </button>
              </div>
                {pagination && <span className="text-sm text-gray-500">{pagination.total} properties</span>}
              </div>

              {loading ? (
                <HouseCardSkeleton count={6} />
              ) : houses.length > 0 ? (
                <>
                  {viewMode === 'map' ? (
                    <MapView houses={houses} />
                  ) : (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                      initial="hidden"
                      animate="visible"
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                    >
                      {houses.map((house, i) => (
                        <motion.div key={house.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
                          <HouseCard house={house} index={i} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10">
                      <button onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1} className="btn-secondary disabled:opacity-40 px-4 py-2 text-sm flex items-center gap-1"><CaretLeft size={14} />Previous</button>
                      <span className="text-sm text-gray-600 px-4">Page {pagination.page} of {pagination.totalPages}</span>
                      <button onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))} disabled={filters.page === pagination.totalPages} className="btn-secondary disabled:opacity-40 px-4 py-2 text-sm flex items-center gap-1">Next<CaretRight size={14} /></button>
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
      {compareIds.length >= 2 && (
        <div className="fixed bottom-4 left-0 right-0 z-[80] flex justify-center px-4">
          <div className="w-full max-w-2xl bg-[#0d4f2e] text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <SquaresFour size={18} weight="duotone" />
              <span className="text-sm font-semibold truncate">
                Compare ({compareIds.length}) listings →
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/compare" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold">
                View
              </Link>
              <button
                type="button"
                onClick={clearCompare}
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

function FilterContent({
  filters,
  updateFilter,
}: {
  filters: Record<string, string | number>
  updateFilter: (key: string, value: string) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="form-label flex items-center gap-1.5"><MapPin size={14} weight="duotone" />District</label>
        <div className="space-y-2">
          {DISTRICTS.map((d) => (
            <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="district" value={d} checked={filters.district === d} onChange={() => updateFilter('district', filters.district === d ? '' : d)} className="w-4 h-4 text-[#0d4f2e] focus:ring-[#16a34a]" />
              <span className="text-sm text-gray-700 group-hover:text-[#0d4f2e] transition-colors">{d}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="divider !my-0" />
      <div>
        <label className="form-label">Category</label>
        <select value={filters.category as string} onChange={(e) => updateFilter('category', e.target.value)} className="form-input" id="filter-category">
          <option value="">All</option>
          <option value="RESIDENTIAL">Residential</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>
      </div>
      <div className="divider !my-0" />
      <div>
        <label className="form-label">Property Type</label>
        <select value={filters.type as string} onChange={(e) => updateFilter('type', e.target.value)} className="form-input" id="filter-type">
          <option value="">All Types</option>
          {TYPES.map((t) => (<option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>))}
        </select>
      </div>
      {filters.category === 'COMMERCIAL' && (
        <>
          <div className="divider !my-0" />
          <div>
            <label className="form-label">Parking</label>
            <div className="flex gap-2">
              <button onClick={() => updateFilter('hasParking', filters.hasParking === 'true' ? '' : 'true')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${filters.hasParking === 'true' ? 'bg-[#0d4f2e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>
                Yes
              </button>
              <button onClick={() => updateFilter('hasParking', filters.hasParking === 'false' ? '' : 'false')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${filters.hasParking === 'false' ? 'bg-[#0d4f2e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>
                No
              </button>
            </div>
          </div>

          <div className="divider !my-0" />
          <div>
            <label className="form-label">Road Access</label>
            <div className="flex gap-2">
              <button onClick={() => updateFilter('nearMainRoad', filters.nearMainRoad === 'true' ? '' : 'true')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${filters.nearMainRoad === 'true' ? 'bg-[#0d4f2e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>
                Near
              </button>
              <button onClick={() => updateFilter('nearMainRoad', filters.nearMainRoad === 'false' ? '' : 'false')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${filters.nearMainRoad === 'false' ? 'bg-[#0d4f2e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>
                Far
              </button>
            </div>
          </div>

          <div className="divider !my-0" />
          <div>
            <label className="form-label">Foot Traffic</label>
            <select value={filters.footTraffic as string} onChange={(e) => updateFilter('footTraffic', e.target.value)} className="form-input" id="filter-foot-traffic">
              <option value="">Any</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </>
      )}
      <div className="divider !my-0" />
      <div>
        <label className="form-label">Price Range (RWF/month)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice as string} onChange={(e) => updateFilter('minPrice', e.target.value)} className="form-input text-sm" id="filter-min-price" />
          <input type="number" placeholder="Max" value={filters.maxPrice as string} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="form-input text-sm" id="filter-max-price" />
        </div>
      </div>
      <div className="divider !my-0" />
      <div>
        <label className="form-label">Bedrooms</label>
        <div className="flex flex-wrap gap-2">
          {BEDROOMS.map((b) => (
            <button key={b} onClick={() => updateFilter('bedrooms', filters.bedrooms === String(b) ? '' : String(b))} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${filters.bedrooms === String(b) ? 'bg-[#0d4f2e] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e]'}`} id={`filter-bed-${b}`}>{b}</button>
          ))}
        </div>
      </div>
      <div className="divider !my-0" />
      <div>
        <label className="form-label">Furnishing</label>
        <div className="flex gap-2">
          <button onClick={() => updateFilter('furnished', filters.furnished === 'true' ? '' : 'true')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${filters.furnished === 'true' ? 'bg-[#0d4f2e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>Furnished</button>
          <button onClick={() => updateFilter('furnished', filters.furnished === 'false' ? '' : 'false')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${filters.furnished === 'false' ? 'bg-[#0d4f2e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}>Unfurnished</button>
        </div>
      </div>
    </div>
  )
}
