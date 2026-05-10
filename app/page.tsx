export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HouseCard from '@/components/houses/HouseCard'
import HomeHero from '@/components/home/HomeHero'
import { House } from '@phosphor-icons/react/dist/ssr'
import { InzuTestimonials } from '@/components/ui/InzuTestimonials'
import HowItWorks from '@/components/home/HowItWorks'
import WhyChooseInzu from '@/components/home/WhyChooseInzu'
import CTABanner from '@/components/home/CTABanner'
import StatsAndNeighborhoods from '@/components/home/StatsAndNeighborhoods'

async function getFeaturedHouses() {
  return prisma.house.findMany({
    where: { status: 'APPROVED' },
    take: 6,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    include: {
      images: { take: 1 },
      landlord: { select: { name: true, isVerified: true } },
    },
  })
}

async function getStats() {
  let houses = 6
  let users = 1

  try {
    houses = await prisma.house.count({ where: { status: 'APPROVED' } })
  } catch {
    houses = 6
  }

  try {
    users = await prisma.user.count({ where: { role: 'TENANT' } })
  } catch {
    users = 1
  }

  return { houses, users, districts: 3, verified: 100 }
}

const TESTIMONIALS = [
  {
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    name: 'Amina Uwimana',
    role: 'Teacher',
    location: 'Gasabo',
    text: 'I found my apartment in Remera within 2 days. No more calling fake numbers! InzuFinder saved me so much time and stress finding a verified home.',
    rating: 5,
    type: 'tenant' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a6dd7228f2d?w=200&h=200&fit=crop&crop=face',
    name: 'Jean-Paul Mugisha',
    role: 'Property Owner',
    location: 'Kicukiro',
    text: 'As a landlord I got 3 genuine tenants in my first week. The admin verification process builds real trust with serious renters.',
    rating: 5,
    type: 'landlord' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face',
    name: 'Claudine Umubyeyi',
    role: 'Business Owner',
    location: 'Nyarugenge',
    text: 'Finally a platform showing real verified houses in Kigali. I found my shop space in Nyamirambo in just 3 days. A total game changer!',
    rating: 5,
    type: 'tenant' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    name: 'Eric Nkurunziza',
    role: 'Software Engineer',
    location: 'Gasabo',
    text: 'The filters are exactly what I needed. Found a furnished studio in Kacyiru under 150k RWF in one afternoon. Highly recommend InzuFinder!',
    rating: 5,
    type: 'tenant' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    name: 'Marie Claire Ingabire',
    role: 'Nurse',
    location: 'Kicukiro',
    text: 'Safe, fast, and no brokers involved. I relocated from Musanze to Kigali and found my apartment before even arriving in the city.',
    rating: 5,
    type: 'tenant' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    name: 'Patrick Habimana',
    role: 'Landlord and Investor',
    location: 'Gasabo',
    text: 'InzuFinder gives my listings professional visibility. Tenants trust my properties immediately because of the admin verification badge.',
    rating: 5,
    type: 'landlord' as const,
  },
]

export default async function HomePage() {
  const featured = await getFeaturedHouses()

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[600px] md:min-h-[680px] flex items-end overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600"
            alt="Modern luxury home in Kigali"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />

          <div className="absolute inset-0 hero-overlay" />
          <HomeHero />
        </section>

        <StatsAndNeighborhoods />

        <section className="section">
          <div className="container-app">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-wider mb-2">Featured Listings</p>
                <h2 className="text-3xl font-bold text-gray-900">Latest Verified Properties</h2>
                <p className="text-gray-500 mt-2">All listings reviewed and approved by our team</p>
              </div>
              <Link href="/houses" className="btn-secondary hidden sm:flex items-center gap-2">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {featured.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((house, i) => (
                  <div key={house.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <HouseCard house={house} index={i} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <House size={32} weight="duotone" className="text-[#16a34a]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings yet</h3>
                <p className="text-gray-500 mb-6">Be the first to list your property in Kigali</p>
                <Link href="/register" className="btn-primary">List Your House</Link>
              </div>
            )}

            <div className="flex justify-center mt-8 sm:hidden">
              <Link href="/houses" className="btn-secondary">View All Properties</Link>
            </div>
          </div>
        </section>

        <HowItWorks />

        <WhyChooseInzu />

        <InzuTestimonials testimonials={TESTIMONIALS} />

        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
