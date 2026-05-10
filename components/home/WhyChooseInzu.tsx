'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, MagnifyingGlass, Users, Lock } from '@phosphor-icons/react'
import Image from 'next/image'

const features = [
  {
    icon: ShieldCheck,
    title: 'Zero Fake Listings',
    description: 'Every property manually reviewed before it goes live.',
  },
  {
    icon: MagnifyingGlass,
    title: 'Find in Minutes',
    description: 'Filter by district, budget, bedrooms, and furnishing.',
  },
  {
    icon: Users,
    title: 'Verified Landlords',
    description: 'See real profiles and contact verified owners.',
  },
  {
    icon: Lock,
    title: 'Safe Experience',
    description: 'Report suspicious listings and browse with confidence.',
  },
]

export default function WhyChooseInzu() {
  return (
    <section className="py-20 bg-[#F0F7F0]">
      <div className="container-app max-w-[1200px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose InzuFinder?</h2>
          <div className="w-12 h-[3px] bg-[#16a34a] mx-auto rounded-full" />
        </motion.div>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* Left Column — Feature Cards */}
          <div className="w-full md:w-[45%] flex flex-col gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-[14px] p-4 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                {/* Green Icon Circle */}
                <div className="w-[52px] h-[52px] rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0">
                  <feature.icon size={24} weight="duotone" className="text-white" />
                </div>
                {/* Text Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column — Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full md:w-[55%] relative"
          >
            <div className="relative w-full h-full min-h-[400px] md:min-h-0 rounded-[20px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Modern apartment interior in Kigali"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 bg-white rounded-[50px] px-5 py-3 shadow-lg flex items-center gap-2">
                <ShieldCheck size={18} weight="fill" className="text-[#16a34a]" />
                <span className="text-sm font-medium text-gray-800">
                  Kigali Homes. <span className="text-[#16a34a] font-bold">Verified.</span>{' '}
                  <span className="text-gray-800">Simple.</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
