'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string
  src?: string | null
  size?: number
  className?: string
}) {
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'U'

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] text-white font-bold',
        className
      )}
      style={{ width: size, height: size }}
      aria-label={name}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" sizes={`${size}px`} />
      ) : (
        <span style={{ fontSize: Math.max(12, Math.floor(size / 2.4)) }}>{initials}</span>
      )}
    </div>
  )
}

