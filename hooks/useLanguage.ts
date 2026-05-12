'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export function useLanguage() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const setLanguage = (newLocale: 'en' | 'rw') => {
    // next-intl's usePathname already returns pathname without locale prefix
    // We just need to navigate to the same path with the new locale
    router.push(pathname, { locale: newLocale })
  }

  return {
    lang: locale.toUpperCase() as 'EN' | 'RW',
    setLanguage
  }
}
