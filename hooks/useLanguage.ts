'use client'

import { usePathname } from 'next/navigation'
import { t, type Language } from '@/lib/i18n'

export function useLanguage() {
  const pathname = usePathname()
  const locale = pathname?.startsWith('/rw') ? 'rw' : 'en'

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
    t: (key: string) => t(locale.toUpperCase() as Language, key),
    setLanguage
  }
}
