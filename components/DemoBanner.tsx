'use client'

import { useEffect, useState } from 'react'
import { X, Flag } from '@phosphor-icons/react'

export default function DemoBanner() {
  const storageKey = 'inzufinder_demo_banner_dismissed'
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(storageKey) === '1')
    } catch {
      // If sessionStorage is unavailable, keep it visible.
    }
  }, [])

  if (dismissed) return null

  return (
    <div className="bg-amber-400/15 border-b border-amber-200 text-amber-900">
      <div className="container-app flex items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Flag size={18} weight="duotone" />
          <span>Demo mode: listings are sample data prepared for testing and presentation.</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-amber-400/20"
          aria-label="Dismiss demo banner"
          onClick={() => {
            setDismissed(true)
            try {
              sessionStorage.setItem(storageKey, '1')
            } catch {
              // ignore
            }
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

