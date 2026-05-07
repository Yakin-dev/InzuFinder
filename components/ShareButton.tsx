'use client'

import toast from 'react-hot-toast'
import { ShareNetwork } from '@phosphor-icons/react'

export function ShareButton({ url }: { url?: string }) {
  return (
    <button
      type="button"
      className="btn-ghost text-sm flex items-center gap-1.5"
      onClick={async () => {
        try {
          const value = url || window.location.href
          await navigator.clipboard?.writeText(value)
          toast.success('Link copied')
        } catch {
          toast.error('Could not copy link')
        }
      }}
    >
      <ShareNetwork size={16} />
      Share
    </button>
  )
}

