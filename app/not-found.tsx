'use client'

import Link from 'next/link'
import { House, MagnifyingGlass } from '@phosphor-icons/react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="text-center px-6 max-w-md">
        <div className="w-20 h-20 bg-[#0d4f2e]/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <MagnifyingGlass size={36} weight="duotone" className="text-[#0d4f2e]" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-3">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <House size={18} weight="fill" />
            Go Home
          </Link>
          <Link href="/houses" className="btn-secondary">
            Browse Houses
          </Link>
        </div>
      </div>
    </div>
  )
}
