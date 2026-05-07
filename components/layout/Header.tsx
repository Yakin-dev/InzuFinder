'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { House, List, X, SignOut, Gear, GridFour, Heart, CaretDown } from '@phosphor-icons/react'
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

  // Fetch current user (treat 401 as guest; avoid spamming requests)
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
    setAccountOpen(false)
    router.push('/')
    router.refresh()
  }

  const accountRootLink =
    user?.role === 'ADMIN'
      ? '/dashboard/admin'
      : user?.role === 'LANDLORD'
        ? '/dashboard/landlord'
        : '/houses'
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

              <LanguageToggle />

              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-expanded={accountOpen}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                    <CaretDown size={16} className="text-gray-500" />
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
                              <Link
                                href="/dashboard/bookings"
                                onClick={() => setAccountOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${
                                  pathname.startsWith('/dashboard/bookings') ? 'bg-green-50 text-[#0d4f2e]' : ''
                                }`}
                              >
                                <GridFour size={16} weight="duotone" />
                                My Bookings
                              </Link>
                              <Link
                                href="/dashboard/saved"
                                onClick={() => setAccountOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${
                                  pathname.startsWith('/dashboard/saved') ? 'bg-green-50 text-[#0d4f2e]' : ''
                                }`}
                              >
                                <Heart size={16} weight="duotone" />
                                Saved Properties
                              </Link>
                              <Link
                                href="/dashboard/profile"
                                onClick={() => setAccountOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${
                                  pathname.startsWith('/dashboard/profile') ? 'bg-green-50 text-[#0d4f2e]' : ''
                                }`}
                              >
                                <Gear size={16} weight="duotone" />
                                Settings
                              </Link>
                            </>
                          ) : user.role === 'LANDLORD' ? (
                            <Link
                              href="/dashboard/landlord"
                              onClick={() => setAccountOpen(false)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${
                                pathname.startsWith('/dashboard/landlord') ? 'bg-green-50 text-[#0d4f2e]' : ''
                              }`}
                            >
                              <GridFour size={16} weight="duotone" />
                              Landlord Dashboard
                            </Link>
                          ) : (
                            <Link
                              href="/dashboard/admin"
                              onClick={() => setAccountOpen(false)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 hover:text-[#0d4f2e] transition-colors ${
                                pathname.startsWith('/dashboard/admin') ? 'bg-green-50 text-[#0d4f2e]' : ''
                              }`}
                            >
                              <Gear size={16} weight="duotone" />
                              Admin Dashboard
                            </Link>
                          )}

                          <div className="my-1 h-px bg-gray-100" />
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <SignOut size={16} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  {user.role === 'TENANT' ? (
                    <>
                      <Link
                        href="/dashboard/bookings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <GridFour size={20} weight="duotone" />
                        My Bookings
                      </Link>
                      <Link
                        href="/dashboard/saved"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Heart size={20} weight="duotone" />
                        Saved Properties
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Gear size={20} weight="duotone" />
                        Settings
                      </Link>
                    </>
                  ) : user.role === 'LANDLORD' ? (
                    <Link
                      href="/dashboard/landlord"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <GridFour size={20} weight="duotone" />
                      Landlord Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#0d4f2e] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Gear size={20} weight="duotone" />
                      Admin Dashboard
                    </Link>
                  )}
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
