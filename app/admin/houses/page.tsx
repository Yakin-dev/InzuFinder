'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Eye, Clock, House } from '@phosphor-icons/react'

interface HouseAdmin {
  id: string
  title: string
  price: number
  location: string
  district: string
  type: string
  status: string
  createdAt: string
  landlord: { name: string }
  images: { url: string }[]
}

export default function AdminHousesPage() {
  const [houses, setHouses] = useState<HouseAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING')

  useEffect(() => {
    fetchHouses()
  }, [filter])

  const fetchHouses = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/houses?status=${filter}&limit=50`)
      const data = await res.json()
      setHouses(data.houses || [])
    } catch {
      setHouses([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/houses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setHouses((prev) =>
        prev.map((h) => (h.id === id ? { ...h, status } : h))
      )
      toast.success(`Listing ${status.toLowerCase()} successfully`)
    } catch {
      toast.error('Failed to update listing status')
    }
  }

  const statusTabs = [
    { label: 'Pending', value: 'PENDING', icon: <Clock size={16} /> },
    { label: 'Approved', value: 'APPROVED', icon: <CheckCircle size={16} /> },
    { label: 'Rejected', value: 'REJECTED', icon: <XCircle size={16} /> },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
        <p className="text-gray-500 mt-1">Review and approve property listings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all ${
              filter === tab.value
                ? 'bg-[#0d4f2e] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5">
              <div className="flex gap-4">
                <div className="w-24 h-16 animate-shimmer rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 animate-shimmer rounded w-2/3" />
                  <div className="h-3 animate-shimmer rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : houses.length > 0 ? (
        <div className="space-y-3">
          {houses.map((house) => (
            <div key={house.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Thumbnail */}
              <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {house.images[0]?.url ? (
                  <img src={house.images[0].url} alt={house.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <House size={24} weight="duotone" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{house.title}</h3>
                <p className="text-sm text-gray-500">{house.location}, {house.district} • By {house.landlord.name}</p>
                <p className="text-sm font-bold text-gray-700 mt-1">{house.price.toLocaleString()} RWF/mo</p>
              </div>

              {/* Status badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${
                house.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                house.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {house.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/houses/${house.id}`}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                  target="_blank"
                >
                  <Eye size={18} />
                </Link>
                {house.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(house.id, 'APPROVED')}
                      className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
                      title="Approve"
                    >
                      <CheckCircle size={22} weight="fill" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(house.id, 'REJECTED')}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                      title="Reject"
                    >
                      <XCircle size={22} weight="fill" />
                    </button>
                  </>
                )}
                {house.status === 'APPROVED' && (
                  <button
                    onClick={() => handleStatusChange(house.id, 'REJECTED')}
                    className="btn-danger text-xs px-3 py-1.5"
                    title="Revoke"
                  >
                    Revoke
                  </button>
                )}
                {house.status === 'REJECTED' && (
                  <button
                    onClick={() => handleStatusChange(house.id, 'APPROVED')}
                    className="btn-primary text-xs px-3 py-1.5"
                    title="Re-approve"
                  >
                    Re-approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <House size={28} weight="duotone" className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No {filter.toLowerCase()} listings</h3>
          <p className="text-gray-500">There are no listings with this status right now.</p>
        </div>
      )}
    </div>
  )
}
