'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChartBar, ListChecks, Flag, SignOut, List, X, ArrowLeft, Gear
} from '@phosphor-icons/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: <ChartBar size={20} weight="duotone" /> },
    { name: 'Pending Listings', href: '/admin/listings', icon: <ListChecks size={20} weight="duotone" /> },
    { name: 'Reports', href: '/admin/reports', icon: <Flag size={20} weight="duotone" /> },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0a1f13] text-white fixed inset-y-0 z-10">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#0d4f2e] flex items-center justify-center">
            <Gear size={18} weight="fill" className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Admin</span>
        </div>

        <div className="px-4 py-6 flex-1">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 px-3">Navigation</p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#16a34a] text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <SignOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-20 bg-[#0a1f13] text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">Admin Panel</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="fixed inset-y-0 left-0 w-64 bg-[#0a1f13] shadow-xl flex flex-col pt-16" onClick={(e) => e.stopPropagation()}>
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-[#16a34a] text-white' : 'text-gray-400'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
