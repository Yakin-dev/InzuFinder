'use client'

import * as React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { useSavedPropertiesStore } from '@/hooks/useSavedProperties'
import { MapPin, Heart } from '@phosphor-icons/react'

export default function SavedPropertiesPage() {
  const { t } = useLanguage()
  const savedStore = useSavedPropertiesStore()
  const [savedHouses, setSavedHouses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [unauthorized, setUnauthorized] = React.useState(false)

  React.useEffect(() => {
    async function run() {
      setLoading(true)
      try {
        await savedStore.load()
        const res = await fetch('/api/saved')
        if (!res.ok) {
          if (res.status === 401) setUnauthorized(true)
          setSavedHouses([])
          return
        }
        const data = await res.json()
        setSavedHouses(data.saved || [])
      } catch {
        setSavedHouses([])
      } finally {
        setLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
        <p className="text-gray-500 mt-1">{t('empty.noSaved')}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-20 bg-gray-100 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : unauthorized ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Please log in to view saved properties.</h3>
          <Link href="/login" className="btn-primary inline-flex mt-5">
            Login
          </Link>
        </div>
      ) : savedHouses.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('empty.noSaved')}</h3>
          <p className="text-gray-500">Tap the heart on listings you like to save them.</p>
          <Link href="/houses" className="btn-primary inline-flex mt-5">
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedHouses.map((h) => (
            <div key={h.id} className="card overflow-hidden">
              <Link href={`/houses/${h.id}`}>
                <div className="aspect-[16/9] bg-gray-100 relative">
                  {/* Minimal rendering since saved payload may differ */}
                  {h.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={h.images[0].url} alt={h.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-900 line-clamp-1">{h.title}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <MapPin size={14} />
                    {h.location}
                  </div>
                  <div className="text-[#0d4f2e] font-bold mt-2">{h.price.toLocaleString()} RWF/mo</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

