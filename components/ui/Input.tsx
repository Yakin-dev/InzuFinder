'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id ?? React.useId()
    return (
      <div className="space-y-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {icon ? (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-11 w-full rounded-xl border bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20',
              icon ? 'pl-10' : '',
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200',
              className
            )}
            {...props}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    )
  }
)
Input.displayName = 'Input'

