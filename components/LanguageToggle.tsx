'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { lang, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className="text-gray-500" />
      <div className="inline-flex rounded-xl overflow-hidden border border-gray-200 bg-white/70">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
            lang === 'EN' ? 'bg-[#0d4f2e] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          aria-pressed={lang === 'EN'}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage('rw')}
          className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
            lang === 'RW' ? 'bg-[#0d4f2e] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          aria-pressed={lang === 'RW'}
        >
          RW
        </button>
      </div>
    </div>
  )
}
