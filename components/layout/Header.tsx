'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { House, List, X, SignOut, Gear, GridFour, Heart } from '@phosphor-icons/react'
import { useScrollPosition } from '@/hooks/useScrollPosition'

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
  const scrolled = useScrollPosition(80)
  const [savedCount, setSavedCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  // Fetch current user on route change
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setUser(data.user || null))
      .catch(() => null)
  }, [pathname])

  // Read favorites count from localStorage
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
    router.push('/')
    router.refresh()
  }

  const dashboardLink = user?.role === 'ADMIN' ? '/admin' : '/dashboard'
  const isActive = (path: string) => pathname === path

  return (
    <>
      <header
        className={`page-header transition-all duration-300 ${
          scrolled ? 'navbar-glass shadow-md' : 'bg-white shadow-none'
        }`}
      >
        <div className="container-app">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className={`bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${scrolled ? 'w-8 h-8' : 'w-9 h-9'}`}>
                <House size={20} weight="fill" className="text-white" />
              </div>
              <span className={`font-bold text-gray-900 tracking-tight transition-all ${scrolled ? 'text-lg' : 'text-xl'}`}>
                Inzu<span className="text-[#0d4f2e]">Finder</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/houses"
                className={`nav-link px-3 py-2 rounded-lg ${isActive('/houses') ? 'nav-link-active' : ''}`}
              >
                Browse Houses
              </Link>
              <Link
                href="/houses?district=Gasabo"
                className="nav-link px-3 py-2 rounded-lg"
              >
                Gasabo
              </Link>
              <Link
                href="/houses?district=Kicukiro"
                className="nav-link px-3 py-2 rounded-lg"
              >
                Kicukiro
              </Link>
              <Link
                href="/houses?district=Nyarugenge"
                className="nav-link px-3 py-2 rounded-lg"
              >
                Nyarugenge
              </Link>
            </div>

            {/* Desktop Auth + Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Favorites indicator */}
              {savedCount > 0 && (
                <Link
                  href="/houses?saved=true"
                  className="relative flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#0d4f2e] transition-colors px-2 py-1.5 rounded-lg"
                >
                  <Heart size={18} weight="fill" className="text-red-400" />
                  <span className="text-xs font-semibold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">{savedCount}</span>
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={dashboardLink}
                    className={`nav-link px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                      pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
                        ? 'nav-link-active'
                        : ''
                    }`}
                  >
                    {user.role === 'ADMIN' ? (
                      <><Gear size={16} weight="duotone" /> Admin</>
                    ) : (
                      <><GridFour size={16} weight="duotone" /> Dashboard</>
                    )}
                  </Link>
                  <div className="w-px h-4 bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost text-sm px-3 py-1.5 flex items-center gap-1.5 text-gray-500 hover:text-red-600"
                  >
                    <SignOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost text-sm">Login</Link>
                  <Link href="/register" className="btn-primary text-sm px-5 py-2.5">
                    List Your House
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Slide-In Drawer */}
      <AnimatePresence>
      {menuOpen && (
        <motion.div className="md:hidden fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <motion.aside
            className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-lg text-gray-900">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <Link
                href="/houses"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <House size={20} weight="duotone" />
                Browse Houses
              </Link>
              <Link
                href="/houses?district=Gasabo"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Gasabo
              </Link>
              <Link
                href="/houses?district=Kicukiro"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Kicukiro
              </Link>
              <Link
                href="/houses?district=Nyarugenge"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Nyarugenge
              </Link>

              <div className="divider !my-4" />

              {user ? (
                <>
                  <Link
                    href={dashboardLink}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <GridFour size={20} weight="duotone" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <SignOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary w-full mt-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
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
