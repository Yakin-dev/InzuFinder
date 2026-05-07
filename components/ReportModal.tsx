'use client'

import * as React from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Flag, WarningCircle } from '@phosphor-icons/react'
import { useLanguage } from '@/hooks/useLanguage'

const REASONS = [
  'Fake photos',
  'Wrong location',
  'Already rented',
  'Wrong price',
  'Scam',
  'Landlord unreachable',
  'Other',
] as const

export function ReportModal({
  open,
  onOpenChange,
  houseId,
  houseTitle,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  houseId: string
  houseTitle: string
}) {
  const { t } = useLanguage()
  const [reason, setReason] = React.useState<(typeof REASONS)[number]>('Fake photos')
  const [details, setDetails] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setReason('Fake photos')
      setDetails('')
      setLoading(false)
    }
  }, [open])

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ houseId, reason, details: details || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      toast.success('Report submitted. Our team will review within 24 hours.')
      onOpenChange(false)
    } catch {
      toast.error('Report failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={t('button.report')}>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <WarningCircle size={20} weight="duotone" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Help us keep listings clean</div>
            <div className="text-sm text-gray-600">Report: {houseTitle}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reason</label>
          <div className="relative">
            <Flag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 bg-white px-10 py-3 text-sm focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Optional details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 resize-none"
            rows={4}
            placeholder="Add any extra context for the review team..."
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void submit()} loading={loading} className="flex-1">
            Submit report
          </Button>
        </div>
      </div>
    </Modal>
  )
}

