'use client'

import Link from 'next/link'
import {
  Home,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Users,
  ChevronRight,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react'
import Newsletter from '@/components/footer/Newsletter'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-24 overflow-hidden" style={{ background: '#03140b' }}>
      {/* Top gradient divider */}
      <div
        className="h-[3px] w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, #16a34a, #4ade80, #16a34a, transparent)',
          opacity: 0.65,
        }}
      />

      {/* Subtle radial glows */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(74,222,128,0.08) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(74,222,128,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-14 md:py-16 lg:py-20">
        {/* Top Stats Bar */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-5 md:p-6 rounded-2xl mb-12 md:mb-16"
          style={{
            background: 'rgba(74, 222, 128, 0.04)',
            border: '1px solid rgba(74, 222, 128, 0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {[
            { icon: Users, value: '500+', label: 'Tenant Searches' },
            { icon: ShieldCheck, value: '22+', label: 'Verified Listings' },
            { icon: MapPin, value: '3', label: 'Districts Covered' },
            { icon: BadgeCheck, value: '100%', label: 'Admin Reviewed' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center text-center relative">
              <stat.icon
                size={18}
                className="mb-2"
                style={{ color: '#4ade80', filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.4))' }}
              />
              <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
              <span
                className="text-[10px] md:text-xs uppercase tracking-wider mt-1"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {stat.label}
              </span>
              {i < 3 && (
                <div
                  className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px"
                  style={{ background: 'rgba(74,222,128,0.15)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand + Newsletter */}
          <div className="lg:col-span-1">
            {/* Brand */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #0d4f2e 0%, #16a34a 100%)',
                }}
              >
                <Home size={18} className="text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">
                Inzu<span style={{ color: '#4ade80' }}>Finder</span>
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm leading-[1.7] mb-5 max-w-[320px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Rwanda&apos;s trusted rental platform for verified homes, shops, and commercial spaces.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: ShieldCheck, label: 'Admin-Verified Listings' },
                { icon: BadgeCheck, label: 'Fraud Protection' },
                { icon: MapPin, label: 'Rwanda First' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(74,222,128,0.08)',
                    border: '1px solid rgba(74,222,128,0.2)',
                    color: '#4ade80',
                  }}
                >
                  <badge.icon size={12} />
                  {badge.label}
                </span>
              ))}
            </div>

            {/* Newsletter */}
            <Newsletter />

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Twitter, href: 'https://twitter.com/inzufinder', label: 'Twitter' },
                { icon: Linkedin, href: 'https://linkedin.com/company/inzufinder', label: 'LinkedIn' },
                { icon: Instagram, href: 'https://instagram.com/inzufinder', label: 'Instagram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    width: '38px',
                    height: '38px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  aria-label={social.label}
                >
                  <social.icon size={16} className="text-white/60 hover:text-[#4ade80] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Browse All Listings', href: '/houses' },
                { label: 'Properties in Gasabo', href: '/houses?district=Gasabo' },
                { label: 'Properties in Kicukiro', href: '/houses?district=Kicukiro' },
                { label: 'Properties in Nyarugenge', href: '/houses?district=Nyarugenge' },
                { label: 'Furnished Properties', href: '/houses?furnished=true' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1 text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    <ChevronRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-[#4ade80]"
                    />
                    <span className="group-hover:text-[#4ade80]">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Platform
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'List Your Property', href: '/register' },
                { label: 'Landlord Dashboard', href: '/dashboard' },
                { label: 'Sign Up', href: '/register' },
                { label: 'Login', href: '/login' },
              ].map((item, i) => (
                <li key={`${item.href}-${i}`}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1 text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    <ChevronRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-[#4ade80]"
                    />
                    <span className="group-hover:text-[#4ade80]">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Admin Portal - subtle */}
            <Link
              href="/admin"
              className="inline-block mt-6 text-xs transition-colors hover:text-[#4ade80]"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Admin Portal
            </Link>
          </div>

          {/* Column 4: Rwanda Coverage */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Rwanda Coverage
            </h3>

            {/* Location Card */}
            <div
              className="rounded-2xl p-5 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(74,222,128,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-[#4ade80]" />
                <span className="text-sm font-semibold text-white">Kigali, Rwanda</span>
              </div>

              <p
                className="text-xs leading-relaxed mb-4"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Serving verified rental discovery across Kigali&apos;s key districts.
              </p>

              {/* District Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['Gasabo', 'Kicukiro', 'Nyarugenge'].map((district) => (
                  <span
                    key={district}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(74,222,128,0.08)',
                      border: '1px solid rgba(74,222,128,0.2)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {district}
                  </span>
                ))}
              </div>

              {/* Trust Row */}
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck size={14} className="text-[#4ade80]" />
                <span className="text-xs text-white/70">Admin-reviewed before going live</span>
              </div>

              <p
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Built for tenants, landlords, and safer property discovery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-5">
          <p
            className="text-center text-xs"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            © {currentYear} InzuFinder. Built for Rwanda&apos;s trusted rental future.
          </p>
        </div>
      </div>
    </footer>
  )
}
