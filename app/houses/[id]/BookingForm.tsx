'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PaperPlaneTilt, CalendarBlank, ChatText, Phone, Clock, SignIn } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export default function BookingForm({ houseId, price }: { houseId: string; price: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    purpose: 'LIVING',
    message: '',
    tenantPhone: '',
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
      setFormData({ preferredDate: '', preferredTime: '', purpose: 'LIVING', message: '', tenantPhone: '' })
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
        <label htmlFor="preferredDate" className="form-label text-sm flex items-center gap-1.5">
          <CalendarBlank size={14} weight="duotone" />
          Preferred Date
        </label>
        <input
          type="date"
          id="preferredDate"
          required
          min={new Date().toISOString().split('T')[0]}
          value={formData.preferredDate}
          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
          className="form-input text-sm w-full bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="preferredTime" className="form-label text-sm flex items-center gap-1.5">
            <Clock size={14} weight="duotone" />
            Preferred Time
          </label>
          <input
            type="time"
            id="preferredTime"
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            className="form-input text-sm w-full bg-gray-50"
          />
        </div>
        <div>
          <label htmlFor="tenantPhone" className="form-label text-sm flex items-center gap-1.5">
            <Phone size={14} weight="duotone" />
            Your Phone Number
          </label>
          <input
            type="tel"
            id="tenantPhone"
            placeholder="+250 788 123 456"
            value={formData.tenantPhone}
            onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
            className="form-input text-sm w-full bg-gray-50"
          />
        </div>
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

      <div>
        <label htmlFor="purpose" className="form-label text-sm flex items-center gap-1.5">
          <SignIn size={14} weight="duotone" />
          Purpose
        </label>
        <select
          id="purpose"
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          className="form-input text-sm w-full bg-gray-50"
        >
          <option value="LIVING">Living</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-500">First month rent</span>
          <span className="font-bold text-gray-900">{price.toLocaleString()} RWF</span>
        </div>

        <Button type="submit" variant="primary" loading={loading} className="w-full py-3">
          <span className="flex items-center gap-2">
            <PaperPlaneTilt size={18} weight="fill" />
            Send Booking Request
          </span>
        </Button>
        <p className="text-center text-xs text-gray-500 mt-3">
          You won&apos;t be charged yet.
        </p>
      </div>
    </form>
  )
}
