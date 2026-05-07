'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { SpinnerGap } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] text-sm font-semibold transition disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]/40 focus-visible:ring-offset-2 ring-offset-white',
  {
    variants: {
      variant: {
        primary:
          'text-white bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] shadow-sm hover:shadow-md',
        secondary:
          'border border-gray-200 bg-white text-gray-900 hover:border-green-200 hover:text-[#0d4f2e]',
        ghost: 'text-gray-700 hover:bg-gray-100',
        danger:
          'text-white bg-gradient-to-br from-[#dc2626] to-[#b91c1c] hover:shadow-md',
        whatsapp: 'text-white bg-[#25D366] hover:brightness-95',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-11 px-4',
        lg: 'h-12 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <SpinnerGap size={18} className="animate-spin" />
            <span className="truncate">Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

