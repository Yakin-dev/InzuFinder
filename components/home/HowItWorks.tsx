'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, CheckCircle, CalendarBlank, House, MapPin, Star, CurrencyDollar, Warning } from '@phosphor-icons/react'

// Card 1 — Browse Listings Mini Mockup
function BrowseMockup() {
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col gap-3 overflow-hidden">
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
        <div className="w-4 h-4 rounded-full bg-gray-200" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      {/* Listing 1 */}
      <div className="flex gap-3 items-start p-2 bg-gray-50 rounded-lg">
        <div className="w-16 h-12 bg-gray-200 rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-3 bg-gray-800 rounded w-24" />
            <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
              <ShieldCheck size={10} weight="fill" />
              Verified
            </span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={10} className="text-gray-400" />
            <div className="h-2.5 bg-gray-300 rounded w-16" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-[#16a34a] rounded w-20" />
            <div className="flex items-center gap-0.5">
              <Star size={10} weight="fill" className="text-yellow-400" />
              <div className="h-2.5 bg-gray-400 rounded w-4" />
            </div>
          </div>
        </div>
      </div>
      {/* Listing 2 */}
      <div className="flex gap-3 items-start p-2 bg-gray-50 rounded-lg">
        <div className="w-16 h-12 bg-gray-200 rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-3 bg-gray-800 rounded w-28" />
            <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
              <ShieldCheck size={10} weight="fill" />
              Verified
            </span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={10} className="text-gray-400" />
            <div className="h-2.5 bg-gray-300 rounded w-14" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-[#16a34a] rounded w-20" />
            <div className="flex items-center gap-0.5">
              <Star size={10} weight="fill" className="text-yellow-400" />
              <div className="h-2.5 bg-gray-400 rounded w-4" />
            </div>
          </div>
        </div>
      </div>
      {/* Listing 3 */}
      <div className="flex gap-3 items-start p-2 bg-gray-50 rounded-lg">
        <div className="w-16 h-12 bg-gray-200 rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-3 bg-gray-800 rounded w-20" />
            <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
              <ShieldCheck size={10} weight="fill" />
              Verified
            </span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={10} className="text-gray-400" />
            <div className="h-2.5 bg-gray-300 rounded w-16" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-[#16a34a] rounded w-20" />
            <div className="flex items-center gap-0.5">
              <Star size={10} weight="fill" className="text-yellow-400" />
              <div className="h-2.5 bg-gray-400 rounded w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 2 — Admin Verified Mini Mockup
function AdminMockup() {
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="h-3 bg-gray-800 rounded w-24" />
        <div className="h-5 bg-[#16a34a] rounded-md w-14" />
      </div>
      {/* Two columns */}
      <div className="flex gap-3 flex-1">
        {/* Left: Pending Review */}
        <div className="flex-1 bg-gray-50 rounded-lg p-2 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="h-2.5 bg-gray-400 rounded w-16" />
            <div className="h-4 w-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold ml-auto">2</div>
          </div>
          {/* Pending item 1 */}
          <div className="flex gap-2 items-center p-1.5 bg-white rounded border border-gray-100">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="flex-1 min-w-0">
              <div className="h-2.5 bg-gray-700 rounded w-full mb-1" />
              <div className="h-2 bg-gray-300 rounded w-12" />
            </div>
          </div>
          {/* Pending item 2 */}
          <div className="flex gap-2 items-center p-1.5 bg-white rounded border border-gray-100">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="flex-1 min-w-0">
              <div className="h-2.5 bg-gray-700 rounded w-full mb-1" />
              <div className="h-2 bg-gray-300 rounded w-10" />
            </div>
          </div>
        </div>
        {/* Right: Approved */}
        <div className="flex-1 bg-green-50 rounded-lg p-2 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle size={12} weight="fill" className="text-[#16a34a]" />
            <div className="h-2.5 bg-[#16a34a] rounded w-14" />
          </div>
          {/* Approved item */}
          <div className="flex gap-2 items-center p-1.5 bg-white rounded border border-green-100">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="flex-1 min-w-0">
              <div className="h-2.5 bg-gray-700 rounded w-full mb-1" />
              <div className="flex items-center gap-1">
                <div className="h-2 bg-gray-300 rounded w-8" />
              </div>
            </div>
            <CheckCircle size={14} weight="fill" className="text-[#16a34a] flex-shrink-0" />
          </div>
          {/* Empty state hint */}
          <div className="flex-1 flex items-center justify-center">
            <div className="h-2 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 3 — Send a Request Mini Mockup
function RequestMockup() {
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col gap-3 overflow-hidden">
      {/* Property card */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex gap-3 items-start mb-2">
          <div className="w-14 h-10 bg-gray-200 rounded-md flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-3 bg-gray-800 rounded w-28 mb-1" />
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-gray-400" />
              <div className="h-2 bg-gray-300 rounded w-16" />
            </div>
          </div>
        </div>
        <div className="h-px bg-gray-200 my-2" />
        {/* Date picker row */}
        <div className="flex items-center gap-2 mb-2">
          <CalendarBlank size={14} className="text-gray-400" />
          <div className="flex-1 h-8 bg-white border border-gray-200 rounded-md flex items-center px-2">
            <div className="h-2.5 bg-gray-300 rounded w-20" />
          </div>
        </div>
        {/* Send button */}
        <button className="w-full h-8 bg-[#16a34a] rounded-md flex items-center justify-center gap-1.5 text-white text-xs font-medium">
          Send Request
        </button>
      </div>
      {/* Safety note */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-2.5">
        <Warning size={14} weight="fill" className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="h-2.5 bg-amber-300 rounded w-32 mb-1" />
          <div className="h-2 bg-amber-200 rounded w-24" />
        </div>
      </div>
    </div>
  )
}

const steps = [
  {
    step: 'STEP 1',
    title: 'Browse Listings',
    desc: 'Search verified properties across all Kigali districts. Filter by price, type, and location.',
    mockup: <BrowseMockup />,
  },
  {
    step: 'STEP 2',
    title: 'Admin Verified',
    desc: 'Every listing is reviewed by our team before going live. No fake listings, ever.',
    mockup: <AdminMockup />,
  },
  {
    step: 'STEP 3',
    title: 'Send a Request',
    desc: 'Found your home? Send a booking request directly to the landlord through our platform.',
    mockup: <RequestMockup />,
  },
]

export default function HowItWorks() {
  return (
    <section className="section bg-white">
      <div className="container-app">
        <div className="text-center mb-16">
          <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-wider mb-2">How It Works</p>
          <h2 className="text-3xl font-bold text-gray-900">Simple, Safe, Trusted</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Preview Area */}
              <div className="bg-[#F5F5F5] h-[220px] overflow-hidden">
                {item.mockup}
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <p className="text-[#16a34a] font-bold text-xs uppercase tracking-wider mb-2">
                  {item.step}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
