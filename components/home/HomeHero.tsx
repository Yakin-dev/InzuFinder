'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import NewHeroSearch from '@/components/home/NewHeroSearch'

export default function HomeHero() {
  const chips = [
    { label: 'Gasabo', href: '/houses?district=Gasabo' },
    { label: 'Kicukiro', href: '/houses?district=Kicukiro' },
    { label: 'Nyarugenge', href: '/houses?district=Nyarugenge' },
    { label: 'Furnished', href: '/houses?furnished=true' },
    { label: 'Studio', href: '/houses?type=STUDIO' },
  ]

  return (
    <div className="container-app relative z-10 pb-16 pt-32 w-full">
      <div className="max-w-3xl">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[#16a34a] text-xs font-bold uppercase tracking-[0.2em] mb-4">
          Kigali&apos;s Most Trusted Rental Platform
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-2 leading-[1.1]">
          Find Your Perfect
        </motion.h1>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-5 leading-[1.1]">
          Home in Kigali
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/70 text-lg max-w-xl leading-relaxed mb-10">
          Verified listings only. No fake posts. Every home reviewed by our team.
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="max-w-4xl">
          <NewHeroSearch />
        </motion.div>
        <div className="mt-5 overflow-x-auto"><div className="flex gap-2 flex-nowrap">
          {chips.map((tag, i) => (
            <motion.div key={tag.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.05 }}>
              <Link href={tag.href} className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full whitespace-nowrap">{tag.label}</Link>
            </motion.div>
          ))}
        </div></div>
      </div>
    </div>
  )
}
