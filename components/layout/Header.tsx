'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  List,
  X,
  LogOut,
  Settings,
  Grid3X3,
  Heart,
  ChevronDown,
} from 'lucide-react'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { LanguageToggle } from '@/components/LanguageToggle'

interface User {
  id: string
  name: string
  email: string
  role: string
  isVerified: boolean
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const scrolled = useScrollPosition(80)
  const [savedCount, setSavedCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/auth/me', { signal: controller.signal })
      .then(async (r) => {
        if (r.status === 401) return { user: null }
        return await r.json()
      })
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('inzu_favorites')
    if (saved) {
      try {
        const arr = JSON.parse(saved)
        setSavedCount(Array.isArray(arr) ? arr.length : 0)
      } catch { setSavedCount(0) }
    }
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setAccountOpen(false)
    router.push('/')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Floating Glass Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ease-out">
        <div
          className={`flex items-center gap-1 px-4 py-2.5 rounded-full border shadow-lg backdrop-blur-xl transition-all duration-500 ${
            scrolled
              ? 'bg-white/80 border-gray-200/60 shadow-xl'
              : 'bg-white/85 border-gray-200/50 shadow-md'
          }`}
          style={{
            WebkitBackdropFilter: 'blur(24px)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200 group-hover:scale-105">
              <Home size={16} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight text-sm">
              Inzu<span className="text-[#0d4f2e]">Finder</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5 ml-6">
            <Link
              href="/houses"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/houses') ? 'bg-[#0d4f2e] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Browse Houses
            </Link>
            <Link href="/houses?district=Gasabo" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Gasabo
            </Link>
            <Link href="/houses?district=Kicukiro" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Kicukiro
            </Link>
            <Link href="/houses?district=Nyarugenge" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Nyarugenge
            </Link>
          </div>

          {/* Desktop Auth + Actions */}
          <div className="hidden lg:flex items-center gap-2 ml-6">
            {savedCount > 0 && (
              <Link href="/houses?saved=true" className="relative flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#0d4f2e] transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50">
                <Heart size={16} className="fill-red-400 text-red-400" />
                <span className="text-xs font-semibold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">{savedCount}</span>
              </Link>
            )}
            <LanguageToggle />
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-expanded={accountOpen}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-64 rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden z-[70]"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="text-sm font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                      <div className="p-2 space-y-1">
                        {user.role === 'TENANT' ? (
                          <>
                            <Link href="/dashboard/bookings" onClick={() => setAccountOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${pathname.startsWith('/dashboard/bookings') ? 'bg-green-50 text-[#0d4f2e]' : ''}`}>
                              <Grid3X3 size={16} /> My Bookings
                            </Link>
                            <Link href="/dashboard/saved" onClick={() => setAccountOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${pathname.startsWith('/dashboard/saved') ? 'bg-green-50 text-[#0d4f2e]' : ''}`}>
                              <Heart size={16} /> Saved Properties
                            </Link>
                            <Link href="/dashboard/profile" onClick={() => setAccountOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${pathname.startsWith('/dashboard/profile') ? 'bg-green-50 text-[#0d4f2e]' : ''}`}>
                              <Settings size={16} /> Settings
                            </Link>
                          </>
                        ) : user.role === 'LANDLORD' ? (
                          <Link href="/dashboard/landlord" onClick={() => setAccountOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${pathname.startsWith('/dashboard/landlord') ? 'bg-green-50 text-[#0d4f2e]' : ''}`}>
                            <Grid3X3 size={16} /> Landlord Dashboard
                          </Link>
                        ) : (
                          <Link href="/dashboard/admin" onClick={() => setAccountOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${pathname.startsWith('/dashboard/admin') ? 'bg-green-50 text-[#0d4f2e]' : ''}`}>
                            <Settings size={16} /> Admin Dashboard
                          </Link>
                        )}
                        <div className="my-1 h-px bg-gray-100" />
                        <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Login</Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#0d4f2e] to-[#16a34a] text-white hover:from-[#0a3d1f] hover:to-[#0ea54e] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg"
                  style={{ boxShadow: '0 2px 12px rgba(13,79,46,0.25)' }}
                >
                  List Your House
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="lg:hidden fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.aside className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3, ease: 'easeOut' }}>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <Link href="/houses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}>
                  <Home size={20} /> Browse Houses
                </Link>
                <Link href="/houses?district=Gasabo" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}>Gasabo</Link>
                <Link href="/houses?district=Kicukiro" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}>Kicukiro</Link>
                <Link href="/houses?district=Nyarugenge" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}>Nyarugenge</Link>
                <div className="border-t border-gray-100 my-4" />
                {user ? (
                  <>
                    {user.role === 'TENANT' ? (
                      <>
                        <Link href="/dashboard/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}><Grid3X3 size={20} /> My Bookings</Link>
                        <Link href="/dashboard/saved" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}><Heart size={20} /> Saved Properties</Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}><Settings size={20} /> Settings</Link>
                      </>
                    ) : user.role === 'LANDLORD' ? (
                      <Link href="/dashboard/landlord" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}><Grid3X3 size={20} /> Landlord Dashboard</Link>
                    ) : (
                      <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors" onClick={() => setMenuOpen(false)}><Settings size={20} /> Admin Dashboard</Link>
                    )}
                    <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"><LogOut size={20} /> Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors" onClick={() => setMenuOpen(false)}>Login</Link>
                    <Link href="/register" className="btn-primary w-full mt-2" onClick={() => setMenuOpen(false)}>Register</Link>
                  </>
                )}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
