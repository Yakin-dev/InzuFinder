'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Home,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  MapPin,
  Building2,
} from 'lucide-react'

export default function CTABanner() {
  return (
    <section className="container-app py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[24px]"
        style={{
          background: 'linear-gradient(135deg, #0a2e1a 0%, #0f4a28 40%, #0a3d1f 100%)',
          minHeight: '220px',
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 70% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Decorative rings */}
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-[0.07]">
          <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
            <circle cx="130" cy="130" r="40" stroke="#4ade80" strokeWidth="1" />
            <circle cx="130" cy="130" r="80" stroke="#4ade80" strokeWidth="1" />
            <circle cx="130" cy="130" r="120" stroke="#4ade80" strokeWidth="1" />
            {/* Nodes */}
            <circle cx="130" cy="130" r="6" fill="#4ade80" />
            <circle cx="90" cy="90" r="4" fill="#4ade80" fillOpacity="0.8" />
            <circle cx="170" cy="100" r="4" fill="#4ade80" fillOpacity="0.8" />
            <circle cx="100" cy="170" r="4" fill="#4ade80" fillOpacity="0.8" />
            <circle cx="180" cy="160" r="4" fill="#4ade80" fillOpacity="0.8" />
            {/* Lines */}
            <line x1="130" y1="130" x2="90" y2="90" stroke="#4ade80" strokeWidth="0.5" opacity="0.4" />
            <line x1="130" y1="130" x2="170" y2="100" stroke="#4ade80" strokeWidth="0.5" opacity="0.4" />
            <line x1="130" y1="130" x2="100" y2="170" stroke="#4ade80" strokeWidth="0.5" opacity="0.4" />
            <line x1="130" y1="130" x2="180" y2="160" stroke="#4ade80" strokeWidth="0.5" opacity="0.4" />
          </svg>
        </div>

        <div className="relative z-10 px-8 py-10 md:px-14 md:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-xl">
              <h2
                className="font-extrabold text-white mb-3"
                style={{ fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 1.15 }}
              >
                Have a Property to Rent?
              </h2>
              <p className="text-white/60 text-sm md:text-[15px] leading-relaxed mb-6 max-w-md">
                List your property on InzuFinder and reach verified tenants across Kigali.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register?role=LANDLORD"
                  className="group inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-[1px]"
                  style={{
                    background: '#4ade80',
                    color: '#0a2e1a',
                    boxShadow: '0 4px 14px rgba(74,222,128,0.35)',
                  }}
                >
                  <Home size={16} strokeWidth={2.5} />
                  List Your Property
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="/houses"
                  className="group inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full border border-white/25 text-white transition-all duration-200 hover:bg-white/8 hover:border-white/40"
                >
                  <Search size={16} strokeWidth={2.5} />
                  Browse Listings
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { icon: ShieldCheck, label: 'Admin Verified' },
                  { icon: Zap, label: 'Fast Approval' },
                  { icon: Users, label: 'Qualified Tenants' },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80"
                  >
                    <badge.icon size={12} className="text-[#4ade80]" strokeWidth={2.5} />
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Stats */}
            <div className="hidden lg:flex items-center gap-3">
              {[
                { icon: Users, value: '500+', label: 'Renters' },
                { icon: Building2, value: '22', label: 'Verified Listings' },
                { icon: MapPin, value: '3', label: 'Districts Covered' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 rounded-xl bg-white/6 border border-white/10 px-5 py-3 min-w-[110px]"
                >
                  <stat.icon size={16} className="text-[#4ade80]" strokeWidth={2} />
                  <span className="text-white font-bold text-lg leading-none">
                    {stat.value}
                  </span>
                  <span className="text-white/40 text-[11px]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
