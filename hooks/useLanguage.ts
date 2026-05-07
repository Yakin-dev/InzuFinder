'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Language } from '@/lib/i18n'
import { t as translate } from '@/lib/i18n'

// NOTE: we read from localStorage to avoid SSR hydration mismatch.
export function useLanguage() {
  const [lang, setLang] = useState<Language>('EN')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('inz_language')
      if (stored === 'RW' || stored === 'EN') setLang(stored)
    } catch {
      // ignore
    }
  }, [])

  const setLanguage = (next: Language) => {
    setLang(next)
    try {
      localStorage.setItem('inz_language', next)
    } catch {
      // ignore
    }
  }

  const t = useMemo(() => (key: string) => translate(lang, key), [lang])

  return { lang, setLanguage, t }
}

