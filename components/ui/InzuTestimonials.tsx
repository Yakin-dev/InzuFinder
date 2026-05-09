'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Star, ArrowDown, ShieldCheck } from '@phosphor-icons/react';

interface Testimonial {
  image: string;
  name: string;
  role: string;
  location: string;
  text: string;
  rating: number;
  type: 'tenant' | 'landlord';
}

interface Props {
  testimonials: Testimonial[];
}


const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const InzuTestimonials: React.FC<Props> = ({ testimonials }) => {
  const [showAll, setShowAll] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const visible = showAll ? testimonials : testimonials.slice(0, 6);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Real Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-2"
          >
            What Kigali Renters Say
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visible.map((t, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Role Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    t.type === 'landlord'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {t.type === 'landlord' ? 'Landlord' : 'Tenant'}
                </span>
              </div>

              {/* Profile Photo — rounded circle */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  {!imgErrors[index] ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={() =>
                        setImgErrors((prev) => ({
                          ...prev,
                          [index]: true,
                        }))
                      }
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] flex items-center justify-center text-white font-bold">
                      {t.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <p className="text-sm text-gray-500">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} weight="fill" className="text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text (English) */}
              <p className="text-gray-700 mb-4 leading-relaxed">"{t.text}"</p>

              {/* Verified Footer */}
              <div className="flex items-center gap-1 border-t border-gray-100 pt-3 mt-1">
                <ShieldCheck weight="fill" className="text-[#16a34a]" size={14} />
                <span className="text-xs text-[#16a34a] font-medium">
                  Verified InzuFinder User
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient Fade */}
        {!showAll && testimonials.length > 6 && (
          <div className="relative h-20 mt-8">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent" />
          </div>
        )}

        {/* Load More */}
        {!showAll && testimonials.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-[#16a34a] hover:text-[#16a34a] transition-all duration-200 shadow-sm"
            >
              <ArrowDown size={16} />
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
