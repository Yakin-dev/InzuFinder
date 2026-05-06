'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PaperPlaneTilt, CalendarBlank, ChatText, Phone } from '@phosphor-icons/react'

export default function BookingForm({ houseId, price }: { houseId: string; price: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    moveInDate: '',
    message: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseId,
          ...formData,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setSuccess(true)
      setFormData({ moveInDate: '', message: '', phone: '' })
      toast.success('Request sent! The landlord will contact you soon.')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-100 p-6 rounded-xl text-center">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <PaperPlaneTilt size={24} weight="fill" />
        </div>
        <h4 className="font-bold text-gray-900 mb-1">Request Sent!</h4>
        <p className="text-sm text-gray-600">
          The landlord will review your request and get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="moveInDate" className="form-label text-sm flex items-center gap-1.5">
          <CalendarBlank size={14} weight="duotone" />
          Desired Move-in Date
        </label>
        <input
          type="date"
          id="moveInDate"
          required
          min={new Date().toISOString().split('T')[0]}
          value={formData.moveInDate}
          onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
          className="form-input text-sm w-full bg-gray-50"
        />
      </div>

      <div>
        <label htmlFor="phone" className="form-label text-sm flex items-center gap-1.5">
          <Phone size={14} weight="duotone" />
          Your Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          placeholder="+250 788 123 456"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="form-input text-sm w-full bg-gray-50"
        />
      </div>

      <div>
        <label htmlFor="message" className="form-label text-sm flex items-center gap-1.5">
          <ChatText size={14} weight="duotone" />
          Message to Landlord (Optional)
        </label>
        <textarea
          id="message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Hi, I'm interested in this property and would like to arrange a viewing..."
          className="form-input text-sm w-full bg-gray-50 resize-none"
        />
      </div>

      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-500">First month rent</span>
          <span className="font-bold text-gray-900">{price.toLocaleString()} RWF</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <PaperPlaneTilt size={18} weight="fill" />
              Send Booking Request
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-500 mt-3">
          You won&apos;t be charged yet.
        </p>
      </div>
    </form>
  )
}
