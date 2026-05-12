'use client'

import Link from 'next/link'
import { House } from '@phosphor-icons/react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="text-center px-6 max-w-md">
        <div className="text-7xl mb-4">🏠</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Oops! This page doesn&apos;t exist</h2>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2"><House size={18} weight="fill" />Go back home</Link>
      </div>
    </div>
  )
}
