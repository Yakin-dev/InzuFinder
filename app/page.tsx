export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HouseCard from '@/components/houses/HouseCard'
import HomeClient from '@/components/home/HomeClient'
import { House, Users, MapPin, ShieldCheck, MagnifyingGlass, Bed } from '@phosphor-icons/react/dist/ssr'

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
  const [houses, users] = await Promise.all([
    prisma.house.count({ where: { status: 'APPROVED' } }),
    prisma.user.count({ where: { role: 'TENANT' } }),
  ])
  return { houses, users }
}

export default async function HomePage() {
  const [featured, stats] = await Promise.all([getFeaturedHouses(), getStats()])

  return (
    <>
      <Header />
      <main>
        {/* Hero Section — Full-width with background image */}
        <section className="relative min-h-[620px] flex items-end overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600"
            alt="Modern home in Kigali"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />

          {/* Dark green gradient overlay */}
          <div className="absolute inset-0 hero-overlay" />

          {/* Hero Content — bottom-left editorial positioning */}
          <div className="container-app relative z-10 pb-16 pt-32 w-full">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <p className="text-[#16a34a] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Kigali&apos;s Most Trusted Rental Platform
              </p>

              {/* H1 */}
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-5 leading-[1.1]">
                Find Your Perfect<br />Home in Kigali
              </h1>

              {/* Subtext */}
              <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-10">
                Verified listings only. No fake posts. Every home reviewed by our team.
              </p>

              {/* Glassmorphism Search Bar */}
              <div className="glass-search rounded-2xl p-2 sm:p-3 max-w-2xl">
                <form action="/houses" method="GET" className="flex flex-col sm:flex-row gap-2">
                  <select
                    name="district"
                    id="hero-district"
                    className="flex-1 px-4 py-3 rounded-xl text-white text-sm bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#16a34a] placeholder:text-white/50 appearance-none"
                    defaultValue=""
                  >
                    <option value="" className="text-gray-900">All Districts</option>
                    <option value="Gasabo" className="text-gray-900">Gasabo</option>
                    <option value="Kicukiro" className="text-gray-900">Kicukiro</option>
                    <option value="Nyarugenge" className="text-gray-900">Nyarugenge</option>
                  </select>
                  <select
                    name="type"
                    id="hero-type"
                    className="flex-1 px-4 py-3 rounded-xl text-white text-sm bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#16a34a] placeholder:text-white/50 appearance-none"
                    defaultValue=""
                  >
                    <option value="" className="text-gray-900">All Types</option>
                    <option value="HOUSE" className="text-gray-900">House</option>
                    <option value="APARTMENT" className="text-gray-900">Apartment</option>
                    <option value="STUDIO" className="text-gray-900">Studio</option>
                    <option value="VILLA" className="text-gray-900">Villa</option>
                  </select>
                  <select
                    name="bedrooms"
                    id="hero-bedrooms"
                    className="flex-1 px-4 py-3 rounded-xl text-white text-sm bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#16a34a] placeholder:text-white/50 appearance-none"
                    defaultValue=""
                  >
                    <option value="" className="text-gray-900">Bedrooms</option>
                    <option value="1" className="text-gray-900">1 Bedroom</option>
                    <option value="2" className="text-gray-900">2 Bedrooms</option>
                    <option value="3" className="text-gray-900">3 Bedrooms</option>
                    <option value="4" className="text-gray-900">4+ Bedrooms</option>
                  </select>
                  <button
                    type="submit"
                    id="hero-search-btn"
                    className="btn-primary px-8 py-3 flex-shrink-0 flex items-center gap-2"
                  >
                    <MagnifyingGlass size={18} weight="bold" />
                    Search
                  </button>
                </form>
              </div>

              {/* Quick filter chips */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { label: 'Gasabo', href: '/houses?district=Gasabo' },
                  { label: 'Kicukiro', href: '/houses?district=Kicukiro' },
                  { label: 'Nyarugenge', href: '/houses?district=Nyarugenge' },
                  { label: 'Furnished', href: '/houses?furnished=true' },
                  { label: 'Studio', href: '/houses?type=STUDIO' },
                  { label: 'Under 200k RWF', href: '/houses?maxPrice=200000' },
                ].map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar — with animated counters */}
        <HomeClient stats={stats} />

        {/* Featured listings */}
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

        {/* How it works */}
        <section className="section bg-white">
          <div className="container-app">
            <div className="text-center mb-12">
              <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-wider mb-2">How It Works</p>
              <h2 className="text-3xl font-bold text-gray-900">Simple, Safe, Trusted</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: <MagnifyingGlass size={28} weight="duotone" className="text-[#0d4f2e]" />,
                  title: 'Browse Listings',
                  desc: 'Search verified properties across all Kigali districts. Filter by price, type, and location.',
                },
                {
                  step: '02',
                  icon: <ShieldCheck size={28} weight="duotone" className="text-[#0d4f2e]" />,
                  title: 'Admin Verified',
                  desc: 'Every listing is reviewed by our team before going live. No fake listings, ever.',
                },
                {
                  step: '03',
                  icon: <Bed size={28} weight="duotone" className="text-[#0d4f2e]" />,
                  title: 'Send a Request',
                  desc: 'Found your home? Send a booking request directly to the landlord through our platform.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center group">
                  <div className="w-16 h-16 bg-[#0d4f2e]/5 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[#0d4f2e]/10 transition-colors">
                    {item.icon}
                  </div>
                  <div className="inline-block text-xs font-bold text-[#0d4f2e] bg-[#0d4f2e]/5 px-2 py-1 rounded-full mb-3">
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container-app">
            <div className="hero-gradient rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full border-2 border-white/10 translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full border border-white/5 -translate-x-12 translate-y-12" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Have a Property to Rent?</h2>
                <p className="text-green-200 mb-8 max-w-lg mx-auto">
                  List your house on InzuFinder and connect with verified tenants across Kigali. Setup takes less than 5 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/register?role=LANDLORD"
                    className="bg-white text-[#0d4f2e] font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 inline-flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <House size={18} weight="fill" />
                    List My House
                  </Link>
                  <Link
                    href="/houses"
                    className="border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 inline-flex items-center justify-center gap-2"
                  >
                    Browse First
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
