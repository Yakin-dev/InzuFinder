'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChartBar, House, PlusCircle, CalendarCheck, UserCircle, ArrowLeft, SignOut, List, X
} from '@phosphor-icons/react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: <ChartBar size={20} weight="duotone" /> },
    { name: 'My Listings', href: '/dashboard/listings', icon: <House size={20} weight="duotone" /> },
    { name: 'Add Listing', href: '/dashboard/new-listing', icon: <PlusCircle size={20} weight="duotone" /> },
    { name: 'Bookings', href: '/dashboard/bookings', icon: <CalendarCheck size={20} weight="duotone" /> },
    { name: 'Profile', href: '/dashboard/profile', icon: <UserCircle size={20} weight="duotone" /> },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-10">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] flex items-center justify-center">
            <House size={18} weight="fill" className="text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">InzuFinder</span>
        </div>

        <div className="px-4 py-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Landlord Menu</p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0d4f2e]/5 text-[#0d4f2e]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all mb-2">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <SignOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] flex items-center justify-center">
            <House size={16} weight="fill" className="text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">InzuFinder</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-10 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col pt-16" onClick={e => e.stopPropagation()}>
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-[#0d4f2e]/5 text-[#0d4f2e]' : 'text-gray-600'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-auto p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <SignOut size={18} />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
