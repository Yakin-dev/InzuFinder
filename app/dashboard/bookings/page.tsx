'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, CalendarBlank, User, Phone, ChatText } from '@phosphor-icons/react'

interface Booking {
  id: string
  message: string | null
  phone: string | null
  status: string
  moveInDate: string | null
  createdAt: string
  house: { id: string; title: string; location: string }
  tenant: { name: string; email: string; phone: string | null }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
      toast.success(`Booking ${status.toLowerCase()} successfully`)
    } catch {
      toast.error('Failed to update booking')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
        <p className="text-gray-500 mt-1">Manage incoming requests from tenants</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="h-4 animate-shimmer rounded w-2/3" />
              <div className="h-3 animate-shimmer rounded w-1/2" />
              <div className="h-3 animate-shimmer rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{booking.house.title}</h3>
                  <p className="text-sm text-gray-500">{booking.house.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${
                  booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                  booking.status === 'DECLINED' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} weight="duotone" className="text-gray-400" />
                  <span className="text-gray-700 font-medium">{booking.tenant.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} weight="duotone" className="text-gray-400" />
                  <span className="text-gray-600">{booking.tenant.phone || booking.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarBlank size={16} weight="duotone" className="text-gray-400" />
                  <span className="text-gray-600">
                    {booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
              </div>

              {booking.message && (
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-xl">
                  <ChatText size={16} weight="duotone" className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p>{booking.message}</p>
                </div>
              )}

              {booking.status === 'PENDING' && (
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleAction(booking.id, 'ACCEPTED')}
                    className="btn-primary text-sm flex items-center gap-1.5 py-2"
                  >
                    <CheckCircle size={16} weight="fill" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(booking.id, 'DECLINED')}
                    className="btn-danger text-sm flex items-center gap-1.5 py-2"
                  >
                    <XCircle size={16} weight="fill" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarBlank size={28} weight="duotone" className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No booking requests</h3>
          <p className="text-gray-500">Booking requests from tenants will appear here</p>
        </div>
      )}
    </div>
  )
}
