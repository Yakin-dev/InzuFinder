'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Star, ChevronDown, ShieldCheck } from 'lucide-react'

interface Testimonial {
  image: string
  name: string
  role: string
  location: string
  text: string
  rating: number
  type: 'tenant' | 'landlord'
}

interface Props {
  testimonials: Testimonial[]
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export function InzuTestimonials({ testimonials }: Props) {
  const [showAll, setShowAll] = useState(false)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const visible = showAll ? testimonials : testimonials.slice(0, 6)

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
          >
            Real Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 mb-2"
          >
            What Kigali Renters Say
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-sm"
          >
            Verified reviews from tenants and landlords across Gasabo, Kicukiro, and Nyarugenge.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {visible.map((t, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              {/* Role Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    t.type === 'landlord'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {t.type === 'landlord' ? 'Landlord' : 'Tenant'}
                </span>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-shrink-0">
                  {!imgErrors[index] ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                      onError={() =>
                        setImgErrors((prev) => ({
                          ...prev,
                          [index]: true,
                        }))
                      }
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-100">
                      {t.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{t.name}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>

              {/* Verified Footer */}
              <div className="flex items-center gap-1.5 border-t border-gray-100 pt-3">
                <ShieldCheck className="text-[#16a34a]" size={14} />
                <span className="text-xs text-[#16a34a] font-medium">
                  Verified User
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient Fade */}
        {!showAll && testimonials.length > 6 && (
          <div className="relative h-16 mt-6">
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}

        {/* Load More */}
        {!showAll && testimonials.length > 6 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-[#16a34a] hover:text-[#16a34a] transition-all duration-200 shadow-sm hover:shadow"
            >
              <ChevronDown size={16} />
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
