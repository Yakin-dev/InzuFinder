'use client'

import * as React from 'react'
import Link from 'next/link'
import { useCompareStore } from '@/hooks/useCompare'
import toast from 'react-hot-toast'
import { useLanguage } from '@/hooks/useLanguage'
import { CheckCircle, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export default function ComparePage() {
  const { lang, t } = useLanguage()
  const { ids, clear } = useCompareStore()
  const [houses, setHouses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function run() {
      if (ids.length < 2) {
        setHouses([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await fetch('/api/houses/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        })
        const data = await res.json()
        setHouses(data.houses || [])
      } catch {
        toast.error('Failed to load comparison')
        setHouses([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [ids])

  if (ids.length < 2) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container-app py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('button.compare')}</h1>
          <p className="text-gray-600">{t('empty.noCompare')}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container-app py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('button.compare')}</h1>
            <p className="text-gray-600">Side-by-side comparison</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={clear} className="flex items-center gap-2">
              <X size={16} />
              Clear
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        ) : houses.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} />
            </div>
            <p className="text-gray-600">Unable to compare these properties right now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <tbody>
                <tr>
                  <td className="sticky left-0 bg-white border-b border-gray-100 p-3 font-semibold text-gray-700 z-10">
                    Field
                  </td>
                  {houses.map((h) => (
                    <td key={h.id} className="border-b border-gray-100 p-3 text-gray-900 font-semibold">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-[220px]">
                          <div className="line-clamp-2">{h.title}</div>
                          <div className="text-xs text-gray-500">
                            {h.district} · {h.location}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <Link href={`/houses/${h.id}`} className="text-[#16a34a] hover:underline">
                            View
                          </Link>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                <Row label="Price" value={(h) => `${h.price.toLocaleString()} RWF/mo`} houses={houses} />
                <Row label="Type" value={(h) => h.type} houses={houses} />
                <Row label="Bedrooms" value={(h) => String(h.bedrooms)} houses={houses} />
                <Row label="Bathrooms" value={(h) => String(h.bathrooms)} houses={houses} />
                <Row label="Availability" value={(h) => h.availability || h.status} houses={houses} />
                <Row label="Landlord" value={(h) => h.landlord?.name || '—'} houses={houses} />
                <Row
                  label="Verified"
                  value={(h) => (h.landlord?.isVerified ? 'Yes' : 'No')}
                  houses={houses}
                />
                <Row
                  label="WhatsApp"
                  value={(h) => (h.whatsappNumber ? 'Available' : 'Not provided')}
                  houses={houses}
                />
                <Row
                  label="Key details"
                  value={(h) => (h.description ? h.description.slice(0, 80) + '…' : '—')}
                  houses={houses}
                />
                <Row
                  label="Amenities"
                  value={(h) => {
                    const a: string[] = []
                    if (h.hasWater) a.push('Water')
                    if (h.hasElectricity) a.push('Electricity')
                    if (h.hasParking) a.push('Parking')
                    if (h.nearMainRoad) a.push('Main road')
                    if (h.nearBusStop) a.push('Bus stop')
                    return a.length ? a.join(', ') : '—'
                  }}
                  houses={houses}
                />
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

function Row({
  label,
  value,
  houses,
}: {
  label: string
  value: (h: any) => string
  houses: any[]
}) {
  return (
    <tr>
      <td className="sticky left-0 bg-white border-b border-gray-100 p-3 font-semibold text-gray-700 z-10">
        {label}
      </td>
      {houses.map((h) => (
        <td key={h.id} className="border-b border-gray-100 p-3 text-gray-900">
          {value(h)}
        </td>
      ))}
    </tr>
  )
}

