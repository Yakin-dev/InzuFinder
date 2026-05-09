'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Star, SpeakerHigh, SpeakerSlash, ArrowDown, ShieldCheck } from '@phosphor-icons/react';

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

const generateWaveVariants = (): Variants[] =>
  Array.from({ length: 20 }, () => ({
    initial: { scaleY: 0.4 },
    animate: {
      scaleY: [0.4, Math.random() * 1.4 + 0.6, 0.4],
      transition: {
        duration: Math.random() * 0.6 + 0.4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: Math.random() * 0.4,
      },
    },
  }));

const waveVariants = generateWaveVariants();

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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const speakEnglish = (text: string, index: number) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    if (playingIndex === index) {
      setPlayingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Use best English voice available
    const voice =
      voices.find((v) => v.lang === 'en-GB') ||
      voices.find((v) => v.lang === 'en-US') ||
      voices.find((v) => v.lang.startsWith('en'));

    if (voice) utterance.voice = voice;
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setPlayingIndex(index);
    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

              {/* Verified Label */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <ShieldCheck size={14} weight="fill" className="text-[#16a34a]" />
                <span>Verified InzuFinder User</span>
              </div>

              {/* English Audio Player */}
              <button
                onClick={() => speakEnglish(t.text, index)}
                className="flex items-center gap-2 text-[#0d4f2e] flex-shrink-0"
              >
                {playingIndex === index ? (
                  <SpeakerSlash size={20} weight="fill" />
                ) : (
                  <SpeakerHigh size={20} weight="fill" />
                )}
                <span className="text-sm font-medium">
                  {playingIndex === index ? 'Stop' : 'Listen'}
                </span>
              </button>

              {/* Animated Waveform */}
              {playingIndex === index && (
                <div className="flex items-center gap-1 mt-3 h-8">
                  {waveVariants.map((variant, i) => (
                    <motion.div
                      key={i}
                      variants={variant}
                      initial="initial"
                      animate="animate"
                      className="w-1 bg-[#16a34a] rounded-full"
                    />
                  ))}
                </div>
              )}
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
