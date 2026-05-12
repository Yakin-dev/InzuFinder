'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export function useLanguage() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const setLanguage = (newLocale: 'en' | 'rw') => {
    if (newLocale === locale) return

    // Save preference
    try {
      localStorage.setItem('inzufinder-locale', newLocale)
    } catch (e) {}

    // Get current path without locale prefix
    const currentPath = window.location.pathname
    const cleanPath = currentPath.startsWith('/rw')
      ? currentPath.slice(3) || '/'
      : currentPath

    // Build new path
    const newPath = newLocale === 'rw'
      ? '/rw' + (cleanPath === '/' ? '' : cleanPath)
      : cleanPath

    // Full reload to re-initialize intl provider correctly
    window.location.href = newPath
  }

  return {
    lang: locale.toUpperCase() as 'EN' | 'RW',
    setLanguage
  }
}
