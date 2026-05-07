import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRWF(amount: number) {
  return `${new Intl.NumberFormat('en-RW').format(amount)} RWF`
}

export function formatDate(value: Date | string | number) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('en-RW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
