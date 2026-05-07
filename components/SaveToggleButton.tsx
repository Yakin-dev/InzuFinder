'use client'

import * as React from 'react'
import { Heart } from '@phosphor-icons/react'
import { useSavedPropertiesStore } from '@/hooks/useSavedProperties'
import { useLanguage } from '@/hooks/useLanguage'

export function SaveToggleButton({ houseId }: { houseId: string }) {
  const { t } = useLanguage()
  const savedStore = useSavedPropertiesStore()
  const isSaved = savedStore.isSaved(houseId)

  return (
    <button
      type="button"
      onClick={() => void savedStore.toggle(houseId)}
      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 transition-colors"
      aria-pressed={isSaved}
    >
      <Heart size={18} weight={isSaved ? 'fill' : 'regular'} className={isSaved ? 'text-red-500' : 'text-gray-500'} />
      <span className="text-sm font-semibold text-gray-700">{isSaved ? t('button.saved') : t('button.save')}</span>
    </button>
  )
}

