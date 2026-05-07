'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SaveToggleButton } from '@/components/SaveToggleButton'
import { ReportModal } from '@/components/ReportModal'
import { Flag } from '@phosphor-icons/react'
import { useLanguage } from '@/hooks/useLanguage'

export function HouseDetailQuickActions({ houseId, houseTitle }: { houseId: string; houseTitle: string }) {
  const { t } = useLanguage()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-3">
      <SaveToggleButton houseId={houseId} />

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Flag size={18} weight="duotone" className="text-gray-500" />
        {t('button.report')}
      </button>

      <ReportModal open={open} onOpenChange={setOpen} houseId={houseId} houseTitle={houseTitle} />
    </div>
  )
}

