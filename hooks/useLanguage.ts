'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export function useLanguage() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const setLanguage = (newLocale: 'en' | 'rw') => {
    // Get pathname without locale prefix
    const segments = pathname.split('/')
    let pathWithoutLocale = pathname

    // Remove locale prefix if present
    if (['en', 'rw'].includes(segments[1])) {
      pathWithoutLocale = '/' + segments.slice(2).join('/')
    }

    // Build new path based on locale
    // With 'as-needed' prefix, English has no prefix, Kinyarwanda has prefix
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`

    router.push(newPath)
  }

  return {
    lang: locale.toUpperCase() as 'EN' | 'RW',
    setLanguage
  }
}
