'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  House,
  MagnifyingGlass,
  ArrowRight,
  ShieldCheck,
  Lightning,
  Users,
  FileText,
  MapPin,
  Heart,
  CheckCircle,
} from '@phosphor-icons/react'

// Left Column — Property Card Component
function PropertyCard({
  image,
  neighborhood,
  title,
  price,
  rotation,
  marginTop,
  marginLeft,
  zIndex,
}: {
  image: string
  neighborhood: string
  title: string
  price: string
  rotation: string
  marginTop?: string
  marginLeft?: string
  zIndex: number
}) {
  return (
    <div
      style={{
        transform: `rotate(${rotation})`,
        marginTop: marginTop || '0',
        marginLeft: marginLeft || '0',
        zIndex,
      }}
      className="bg-white rounded-[16px] overflow-hidden w-[200px] shadow-xl relative"
    >
      {/* Image Area */}
      <div className="relative h-[110px] w-full">
        <Image src={image} alt={title} fill className="object-cover" sizes="200px" />
        {/* Verified Badge */}
        <span
          className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-[3px] rounded-[20px]"
          style={{ background: '#22c55e' }}
        >
          VERIFIED
        </span>
        {/* Heart Icon */}
        <Heart
          size={16}
          weight="fill"
          className="absolute top-2 right-2 text-white drop-shadow-md"
        />
      </div>
      {/* Content */}
      <div className="p-2.5 pb-3">
        <p className="text-xs font-semibold text-[#111]">{neighborhood}</p>
        <p className="text-[11px] text-[#555] mt-0.5 leading-tight">{title}</p>
        <p className="text-[11px] text-[#16a34a] font-semibold mt-1">{price}</p>
      </div>
    </div>
  )
}

// Right Column — Kigali Map Graphic
function KigaliMap() {
  return (
    <div className="relative h-[280px] w-full opacity-85 overflow-hidden">
      {/* Building Silhouettes */}
      <div className="absolute bottom-0 right-0 flex items-end gap-1">
        <div
          className="rounded-t-[4px]"
          style={{
            width: 60,
            height: 120,
            background: 'rgba(34,197,94,0.15)',
          }}
        />
        <div
          className="rounded-t-[4px]"
          style={{
            width: 80,
            height: 180,
            background: 'rgba(34,197,94,0.12)',
          }}
        />
        <div
          className="rounded-t-[4px]"
          style={{
            width: 55,
            height: 100,
            background: 'rgba(34,197,94,0.18)',
          }}
        />
        <div
          className="rounded-t-[4px]"
          style={{
            width: 70,
            height: 150,
            background: 'rgba(34,197,94,0.10)',
          }}
        />
      </div>

      {/* SVG Map Network */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 300 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Concentric rings around main node */}
        <circle
          cx="150"
          cy="140"
          r="40"
          stroke="rgba(74,222,128,0.12)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="150"
          cy="140"
          r="70"
          stroke="rgba(74,222,128,0.12)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="150"
          cy="140"
          r="100"
          stroke="rgba(74,222,128,0.08)"
          strokeWidth="1"
          fill="none"
        />

        {/* Connection lines */}
        <line
          x1="150"
          y1="140"
          x2="100"
          y2="100"
          stroke="rgba(74,222,128,0.3)"
          strokeWidth="1"
        />
        <line
          x1="150"
          y1="140"
          x2="200"
          y2="90"
          stroke="rgba(74,222,128,0.3)"
          strokeWidth="1"
        />
        <line
          x1="150"
          y1="140"
          x2="80"
          y2="180"
          stroke="rgba(74,222,128,0.3)"
          strokeWidth="1"
        />
        <line
          x1="150"
          y1="140"
          x2="220"
          y2="170"
          stroke="rgba(74,222,128,0.3)"
          strokeWidth="1"
        />

        {/* Small nodes */}
        <circle cx="100" cy="100" r="5" fill="#4ade80" fillOpacity="0.9" />
        <circle cx="200" cy="90" r="5" fill="#4ade80" fillOpacity="0.9" />
        <circle cx="80" cy="180" r="5" fill="#4ade80" fillOpacity="0.9" />
        <circle cx="220" cy="170" r="5" fill="#4ade80" fillOpacity="0.9" />

        {/* Main Kigali node */}
        <circle cx="150" cy="140" r="8" fill="#4ade80" />
        {/* Pulsing ring */}
        <circle
          cx="150"
          cy="140"
          r="16"
          stroke="#4ade80"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        >
          <animate
            attributeName="r"
            values="8;20"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Map Pin Icons */}
      <div className="absolute top-[100px] left-[100px] text-[#4ade80]">
        <MapPin size={16} weight="fill" />
      </div>
      <div className="absolute top-[90px] right-[90px] text-[#4ade80]">
        <MapPin size={16} weight="fill" />
      </div>
      <div className="absolute bottom-[100px] left-[80px] text-[#4ade80]">
        <MapPin size={16} weight="fill" />
      </div>
      <div className="absolute bottom-[110px] right-[80px] text-[#4ade80]">
        <MapPin size={16} weight="fill" />
      </div>

      {/* Kigali Label */}
      <div
        className="absolute top-[130px] left-[165px] text-[13px] text-white font-medium rounded-[20px] px-3 py-1"
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        Kigali
      </div>
    </div>
  )
}

export default function CTABanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #0a2e1a 0%, #0f4a28 40%, #0a3d1f 100%)',
        minHeight: '280px',
      }}
    >
      {/* Radial glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="container-app max-w-[1200px] py-[60px] px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] items-center gap-10">
          {/* LEFT COLUMN — Floating Property Cards */}
          <div className="hidden lg:flex relative justify-center items-center pt-10 pb-5">
            <div className="relative">
              <PropertyCard
                image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"
                neighborhood="Kimihurura"
                title="Modern 3 Bedroom House"
                price="FRW 1,200,000 / month"
                rotation="-6deg"
                zIndex={2}
              />
              <PropertyCard
                image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"
                neighborhood="Kacyiru"
                title="Elegant Family Home"
                price="FRW 950,000 / month"
                rotation="4deg"
                marginTop="-40px"
                marginLeft="30px"
                zIndex={1}
              />
            </div>
          </div>

          {/* CENTER COLUMN — Main CTA Content */}
          <div className="text-center">
            {/* Home Icon */}
            <div
              className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center mx-auto mb-4"
              style={{ border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              <House size={20} weight="fill" className="text-white" />
            </div>

            {/* Heading */}
            <h2
              className="font-extrabold text-white leading-[1.15] mb-3"
              style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}
            >
              Have a Property to Rent?
            </h2>

            {/* Subtext */}
            <p
              className="mx-auto mb-6"
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.70)',
                lineHeight: 1.6,
                maxWidth: '420px',
              }}
            >
              List your house on InzuFinder and connect with verified tenants
              across Kigali. Setup takes less than 5 minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Primary Button */}
              <Link
                href="/register?role=LANDLORD"
                className="group inline-flex items-center justify-center gap-2 font-bold text-[15px] px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-[1px]"
                style={{
                  background: '#4ade80',
                  color: '#0a2e1a',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#22c55e'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#4ade80'
                }}
              >
                <House size={18} weight="fill" />
                List My House
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Secondary Button */}
              <Link
                href="/houses"
                className="group inline-flex items-center justify-center gap-2 font-semibold text-[15px] px-7 py-3.5 rounded-full transition-all duration-200 text-white"
                style={{
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.borderColor = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                }}
              >
                <MagnifyingGlass size={18} />
                Browse Listings
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Trust Badge Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                { icon: ShieldCheck, label: 'Admin Verified' },
                { icon: Lightning, label: 'Fast Approval' },
                { icon: Users, label: 'Qualified Tenants' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
                  style={{
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  <badge.icon size={14} weight="fill" className="text-[#4ade80]" />
                  <span>{badge.label}</span>
                  <CheckCircle size={12} weight="fill" className="text-[#4ade80]" />
                </div>
              ))}
            </div>

            {/* Stat Boxes */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center">
              {[
                {
                  icon: Users,
                  value: '500+',
                  label: 'Renters',
                },
                {
                  icon: FileText,
                  value: '22',
                  label: 'Verified Listings',
                },
                {
                  icon: MapPin,
                  value: '3',
                  label: 'Districts Covered',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl flex-1 sm:flex-none"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <stat.icon size={18} weight="fill" className="text-white flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-white font-bold text-lg leading-tight">
                      {stat.value}
                    </p>
                    <p
                      className="text-[12px]"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Kigali Map */}
          <div className="hidden lg:block">
            <KigaliMap />
          </div>
        </div>
      </div>
    </section>
  )
}
