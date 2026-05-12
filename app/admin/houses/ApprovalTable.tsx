'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type House = {
  id: string
  title: string
  price: number
  status: string
  createdAt: Date
  landlord: { name: string; email: string; isVerified: boolean }
  images: { url: string }[]
}

export default function ApprovalTable({ initialHouses }: { initialHouses: House[] }) {
  const [houses, setHouses] = useState(initialHouses)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/houses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      })

      if (!res.ok) throw new Error('Failed to update status')
      
      setHouses(houses.map(h => h.id === id ? { ...h, status: action } : h))
      router.refresh()
    } catch (error) {
      alert('Error updating house status')
    } finally {
      setLoadingId(null)
    }
  }

  const toggleVerifyLandlord = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/houses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifyLandlord: !currentStatus }),
      })
      if (!res.ok) throw new Error('Failed to verify landlord')
      
      const { house } = await res.json()
      setHouses(houses.map(h => h.id === id ? { ...h, landlord: house.landlord } : h))
    } catch (error) {
      alert('Error verifying landlord')
    }
  }

  if (houses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="text-4xl mb-4">🏠</div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Pending Approvals</h3>
        <p className="text-gray-500">All property listings have been reviewed.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Landlord</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {houses.map((house) => (
              <tr key={house.id}>
                <td className="px-4 py-4 min-w-[250px]">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                      {house.images[0] ? (
                        <Image src={house.images[0].url} alt={house.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">{house.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{house.price.toLocaleString()} RWF/mo</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{house.landlord.name}</p>
                      <p className="text-gray-500 text-xs">{house.landlord.email}</p>
                    </div>
                    <button
                      onClick={() => toggleVerifyLandlord(house.id, house.landlord.isVerified)}
                      className={`ml-2 p-1 rounded-full border transition-colors ${
                        house.landlord.isVerified 
                          ? 'bg-green-50 border-green-200 text-green-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                          : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                      }`}
                      title={house.landlord.isVerified ? "Revoke Verification" : "Verify Landlord"}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        {house.landlord.isVerified 
                          ? <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        }
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`badge ${
                    house.status === 'APPROVED' ? 'badge-approved' :
                    house.status === 'REJECTED' ? 'badge-rejected' :
                    'badge-pending'
                  }`}>
                    {house.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(house.id, 'APPROVED')}
                      disabled={loadingId === house.id || house.status === 'APPROVED'}
                      className="btn-ghost !py-1.5 !px-3 text-xs bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(house.id, 'REJECTED')}
                      disabled={loadingId === house.id || house.status === 'REJECTED'}
                      className="btn-ghost !py-1.5 !px-3 text-xs bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <a href={`/houses/${house.id}`} target="_blank" className="btn-ghost !py-1.5 !px-2 text-xs border border-gray-200" rel="noreferrer">
                      View
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
