'use client'

import { motion } from 'framer-motion'
import NewHeroSearch from '@/components/home/NewHeroSearch'

export default function HomeHero() {
  return (
    <div className="container-app relative z-10 pb-16 pt-28 md:pt-36 w-full">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#4ade80] text-xs font-bold uppercase tracking-[0.2em] mb-4"
        >
          Kigali&apos;s Most Trusted Rental Platform
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-3 leading-[1.1]"
        >
          Find Verified Homes in Kigali
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed mb-8"
        >
          Browse admin-reviewed rentals, shops, and commercial spaces with confidence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-[900px]"
        >
          <NewHeroSearch />
        </motion.div>
      </div>
    </div>
  )
}
