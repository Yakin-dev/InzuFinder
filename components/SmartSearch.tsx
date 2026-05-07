'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MagicWand, SpinnerGap } from '@phosphor-icons/react'
import { useLanguage } from '@/hooks/useLanguage'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type Filters = Record<string, unknown>

const SUGGESTIONS = [
  'furnished shop near Kimironko market under 300000',
  'cheap house in Kigali',
  '2 bedroom house in Kimironko',
  'commercial space in Nyamirambo',
]

export default function SmartSearch() {
  const { t } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const apply = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      const filters: Filters = data?.filters || {}

      // Build houses query params (only supported fields)
      const params = new URLSearchParams()
      const setIf = (k: string, v: unknown) => {
        if (v === undefined || v === null || v === '' || v === false) return
        params.set(k, String(v))
      }

      setIf('district', filters.district)
      setIf('type', filters.type)
      setIf('category', filters.category)
      setIf('minPrice', filters.minPrice)
      setIf('maxPrice', filters.maxPrice)
      setIf('bedrooms', filters.bedrooms)
      if (typeof filters.furnished === 'boolean') params.set('furnished', String(filters.furnished))
      if (typeof filters.hasParking === 'boolean') params.set('hasParking', String(filters.hasParking))
      if (typeof filters.nearMainRoad === 'boolean') params.set('nearMainRoad', String(filters.nearMainRoad))
      if (filters.footTraffic) params.set('footTraffic', String(filters.footTraffic))

      // Get results count for toast (best-effort)
      try {
        const countRes = await fetch(`/api/houses?${params.toString()}&limit=1`)
        const countData = await countRes.json()
        const total = countData?.pagination?.total ?? null
        toast.success(`AI found ${total ?? 'some'} properties for you`)
      } catch {
        toast.success(`AI found properties for you`)
      }

      router.push(`/houses?${params.toString()}`)
      router.refresh()
    } catch {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          void apply()
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md px-3 py-2 flex-1">
            <MagicWand
              size={18}
              weight="duotone"
              className={cn('text-white', loading && 'animate-spin')}
            />
            <input
              className="w-full bg-transparent text-white placeholder:text-white/70 text-sm outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              aria-label="Smart search query"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="!px-6 !py-3"
            loading={loading}
          >
            {loading ? (
              <>
                <SpinnerGap size={18} className="animate-spin" />
                Searching…
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full whitespace-nowrap"
              onClick={() => setQuery(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}

