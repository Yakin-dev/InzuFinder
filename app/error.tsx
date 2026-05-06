'use client'

import Link from 'next/link'
import { House, Warning } from '@phosphor-icons/react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="text-center px-6 max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Warning size={36} weight="duotone" className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Please try again or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary flex items-center gap-2">
            <House size={18} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
