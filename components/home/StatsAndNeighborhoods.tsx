'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Search,
  MapPin,
  CheckCircle,
  Building2,
  DollarSign,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'

// ── Stats Data ──
const statsData = [
  {
    value: 150,
    suffix: '+',
    label: 'Verified Listings',
    support: 'Approved before going live',
    icon: ShieldCheck,
  },
  {
    value: 500,
    suffix: '+',
    label: 'Tenant Searches',
    support: 'Across Kigali rental searches',
    icon: Search,
  },
  {
    value: 3,
    suffix: '',
    label: 'Districts Covered',
    support: 'Gasabo, Kicukiro, Nyarugenge',
    icon: MapPin,
  },
  {
    value: 100,
    suffix: '%',
    label: 'Admin Reviewed',
    support: 'Every listing checked',
    icon: CheckCircle,
  },
]

// ── District Data ──
const districts = [
  {
    name: 'Gasabo',
    sectors: 'Kacyiru \u2022 Kimihurura \u2022 Remera \u2022 Gisozi',
    bestFor: 'Professionals and families',
    rentRange: '250k\u20131.2M RWF/mo',
    listings: 8,
    gradient: 'from-[#0a3d1f] to-[#14532d]',
    accent: '#22c55e',
  },
  {
    name: 'Kicukiro',
    sectors: 'Niboye \u2022 Gikondo \u2022 Kagarama \u2022 Kanombe',
    bestFor: 'Students and working tenants',
    rentRange: '150k\u2013800k RWF/mo',
    listings: 7,
    gradient: 'from-[#0d4f2e] to-[#166534]',
    accent: '#4ade80',
  },
  {
    name: 'Nyarugenge',
    sectors: 'CBD \u2022 Nyamirambo \u2022 Muhima \u2022 Gitega',
    bestFor: 'Business and commercial rentals',
    rentRange: '180k\u20131.5M RWF/mo',
    listings: 7,
    gradient: 'from-[#14532d] to-[#0a3d1f]',
    accent: '#16a34a',
  },
]

// ── Single Stat Card ──
function StatCard({
  stat,
  index,
}: {
  stat: (typeof statsData)[0]
  index: number
}) {
  const count = useCountUp(stat.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative rounded-2xl border border-gray-100 bg-gradient-to-br from-[#f0fdf4] via-white to-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    >
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <stat.icon size={26} className="text-[#0d4f2e]" strokeWidth={2} />
      </div>

      {/* Value */}
      <div
        ref={count.ref}
        className="text-3xl font-extrabold tracking-tight text-gray-900"
      >
        {count.value}
        {stat.suffix}
      </div>

      {/* Label */}
      <div className="mt-1 text-sm font-semibold text-gray-800">
        {stat.label}
      </div>

      {/* Support text */}
      <div className="mt-1.5 text-xs text-gray-500">{stat.support}</div>
    </motion.div>
  )
}

// ── District Card ──
function DistrictCard({
  district,
  index,
}: {
  district: (typeof districts)[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <Link
        href={`/houses?district=${district.name}`}
        className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        {/* Header gradient */}
        <div
          className={`relative bg-gradient-to-br ${district.gradient} px-6 py-6 text-white`}
        >
          {/* Decorative grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-green-200/90 text-xs font-medium mb-1">
                <MapPin size={12} strokeWidth={2.5} />
                <span>District</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                {district.name}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <Building2 size={18} className="text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Sectors */}
          <p className="relative z-10 mt-3 text-sm text-green-100/90">
            {district.sectors}
          </p>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                Best For
              </p>
              <p className="text-sm font-medium text-gray-700">
                {district.bestFor}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                Average Rent
              </p>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                <DollarSign size={13} className="text-[#16a34a]" strokeWidth={2.5} />
                {district.rentRange}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                Listings
              </p>
              <div className="flex items-center gap-1 text-sm font-bold text-[#16a34a]">
                <ShieldCheck size={13} strokeWidth={2.5} />
                {district.listings} verified
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f0fdf4] px-4 py-3 transition-colors group-hover:bg-[#dcfce7]">
            <span className="text-sm font-semibold text-[#0d4f2e]">
              View listings
            </span>
            <ArrowRight
              size={16}
              className="text-[#16a34a] transition-transform group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Main Component ──
export default function StatsAndNeighborhoods() {
  return (
    <div>
      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section className="bg-[#fafaf9] border-b border-gray-100">
        <div className="container-app py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-wider mb-2">
              Platform at a Glance
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted Numbers
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {statsData.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>

          {/* Trust bridge pills */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: ShieldCheck, text: 'Admin-reviewed listings' },
              { icon: MapPin, text: 'Kigali-focused search' },
              { icon: Users, text: 'Tenant-safe discovery' },
            ].map((pill) => (
              <div
                key={pill.text}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm"
              >
                <pill.icon
                  size={15}
                  className="text-[#16a34a]"
                  strokeWidth={2.5}
                />
                <span>{pill.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ NEIGHBORHOODS SECTION ═══════════════ */}
      <section className="bg-white">
        <div className="container-app py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12 text-center"
          >
            <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-wider mb-2">
              Find Your Area
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Explore by Neighborhood
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Find your perfect home in Kigali&apos;s most popular rental areas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {districts.map((district, i) => (
              <DistrictCard key={district.name} district={district} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
