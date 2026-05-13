'use client'

import { useState, useEffect } from 'react'
import { t, type Language } from '@/lib/i18n'

function getSavedLocale(): 'EN' | 'RW' {
  if (typeof window === 'undefined') return 'EN'
  try {
    const saved = localStorage.getItem('inzufinder-locale')
    if (saved === 'rw' || saved === 'RW') return 'RW'
  } catch {}
  return 'EN'
}

export function useLanguage() {
  const [lang, setLang] = useState<'EN' | 'RW'>(getSavedLocale)

  useEffect(() => {
    setLang(getSavedLocale())
  }, [])

  const setLanguage = (newLocale: 'en' | 'rw') => {
    const upper = newLocale.toUpperCase() as 'EN' | 'RW'
    if (upper === lang) return

    try {
      localStorage.setItem('inzufinder-locale', newLocale)
    } catch {}

    // Reload page so every component re-reads the new locale — no route change
    window.location.reload()
  }

  return {
    lang,
    t: (key: string) => t(lang as Language, key),
    setLanguage,
  }
}
