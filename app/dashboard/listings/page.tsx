'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { PlusCircle, PencilSimple, Trash, Eye, MapPin } from '@phosphor-icons/react'

interface House {
  id: string
  title: string
  price: number
  location: string
  district: string
  type: string
  bedrooms: number
  status: string
  viewCount: number
  createdAt: string
  images: { url: string }[]
}

export default function ListingsPage() {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/houses?landlord=me&limit=100')
      const data = await res.json()
      setHouses(data.houses || [])
    } catch {
      setHouses([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/houses/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setHouses((prev) => prev.filter((h) => h.id !== id))
      toast.success('Listing deleted successfully')
    } catch {
      toast.error('Failed to delete listing')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-500 mt-1">Manage all your property listings</p>
        </div>
        <Link href="/dashboard/new-listing" className="btn-primary text-sm flex items-center gap-2">
          <PlusCircle size={18} />
          Add New Listing
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5">
              <div className="flex gap-4">
                <div className="w-24 h-18 animate-shimmer rounded-lg" />
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
              {/* Image thumbnail */}
              <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {house.images[0]?.url ? (
                  <img src={house.images[0].url} alt={house.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                    <MapPin size={24} weight="duotone" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{house.title}</h3>
                <p className="text-sm text-gray-500">{house.location}, {house.district}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-gray-900">{house.price.toLocaleString()} RWF/mo</span>
                  <span className="text-xs text-gray-400">{house.bedrooms} bed • {house.type.toLowerCase()}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  house.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  house.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {house.status}
                </span>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye size={14} />
                  {house.viewCount || 0}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/houses/${house.id}`}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                  title="View"
                >
                  <Eye size={18} />
                </Link>
                <Link
                  href={`/dashboard/edit/${house.id}`}
                  className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  title="Edit"
                >
                  <PencilSimple size={18} />
                </Link>
                <button
                  onClick={() => setDeleteId(house.id)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} weight="duotone" className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No listings yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first property listing</p>
          <Link href="/dashboard/new-listing" className="btn-primary inline-flex">
            <PlusCircle size={18} />
            Add New Listing
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Listing</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
