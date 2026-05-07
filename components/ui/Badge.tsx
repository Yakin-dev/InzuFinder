'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ShieldCheck, Star } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        verified: 'bg-green-100 text-green-800',
        featured: 'bg-amber-100 text-amber-800',
        available: 'bg-green-100 text-green-800',
        rented: 'bg-red-100 text-red-800',
        pending: 'bg-amber-100 text-amber-800',
        commercial: 'bg-blue-100 text-blue-800',
        residential: 'bg-emerald-100 text-emerald-900',
      },
    },
    defaultVariants: { variant: 'residential' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  withIcon?: boolean
}

export function Badge({ className, variant, withIcon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {withIcon && variant === 'verified' && <ShieldCheck size={12} weight="fill" />}
      {withIcon && variant === 'featured' && <Star size={12} weight="fill" />}
      {children}
    </span>
  )
}

