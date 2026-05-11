'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export function useLanguage() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const setLanguage = (newLocale: 'en' | 'rw') => {
    // Remove the current locale from pathname if it exists
    const segments = pathname.split('/')
    const hasLocale = ['en', 'rw'].includes(segments[1])
    
    let newPath: string
    if (hasLocale) {
      // Replace the current locale
      segments[1] = newLocale
      newPath = segments.join('/')
    } else {
      // Add the new locale (for non-default locale)
      newPath = `/${newLocale}${pathname}`
    }
    
    router.push(newPath)
  }

  return { 
    lang: locale.toUpperCase() as 'EN' | 'RW', 
    setLanguage 
  }
}
