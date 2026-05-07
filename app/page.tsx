export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HouseCard from '@/components/houses/HouseCard'
import HomeClient from '@/components/home/HomeClient'
import HomeHero from '@/components/home/HomeHero'
import ScrollReveal from '@/components/ScrollReveal'
import { House, ShieldCheck, Lightning, Users, Heart, Quotes, MapPin, MagnifyingGlass, Bed } from '@phosphor-icons/react/dist/ssr'

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

export default async function HomePage() {
  const [featured, stats] = await Promise.all([getFeaturedHouses(), getStats()])

  return (
    <>
      <Header />
      <main>
        <div className="bg-[#0d4f2e] text-white py-2 overflow-hidden">
          <div className="marquee whitespace-nowrap">
            <span className="mx-4">✓ Admin Verified Listings • ✓ No Fake Posts • ✓ Kigali&apos;s #1 Rental Platform • ✓ 100% Free to Browse • ✓ RDB Registered Business •</span>
            <span className="mx-4">✓ Admin Verified Listings • ✓ No Fake Posts • ✓ Kigali&apos;s #1 Rental Platform • ✓ 100% Free to Browse • ✓ RDB Registered Business •</span>
          </div>
        </div>
        <section className="relative min-h-[620px] flex items-end overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600"
            alt="Modern home in Kigali"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />

          <div className="absolute inset-0 hero-overlay" />
          <HomeHero />
        </section>

        <ScrollReveal><HomeClient stats={stats} /></ScrollReveal>

        <ScrollReveal className="section bg-white">
          <div className="container-app">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 text-center">Explore by Neighborhood</h2>
            <p className="text-gray-600 text-center mb-10">Find your perfect home in Kigali&apos;s most popular areas</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { district: 'Gasabo', places: 'Kacyiru • Kimihurura • Remera • Gisozi', badge: 'Most Popular', gradient: 'from-[#0d4f2e] to-[#166534]' },
                { district: 'Kicukiro', places: 'Niboye • Gikondo • Kagarama • Kanombe', gradient: 'from-[#16a34a] to-[#0d4f2e]' },
                { district: 'Nyarugenge', places: 'CBD • Nyamirambo • Muhima • Gitega', gradient: 'from-[#14532d] to-[#0d4f2e]' },
              ].map((item) => (
                <Link key={item.district} href={`/houses?district=${item.district}`} className={`h-48 rounded-2xl p-6 text-white bg-gradient-to-br ${item.gradient} transition-transform hover:scale-105`}>
                  <MapPin size={28} weight="duotone" />
                  <h3 className="text-2xl font-bold tracking-tight mt-4">{item.district} District</h3>
                  <p className="text-green-100 text-sm mt-2">{item.places}</p>
                  {item.badge && <span className="mt-4 inline-block px-3 py-1 rounded-full bg-white/20 text-xs">{item.badge}</span>}
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

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

        <ScrollReveal className="section bg-white">
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
        </ScrollReveal>

        <ScrollReveal className="section">
          <div className="container-app">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-10">Why Choose InzuFinder?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <ShieldCheck size={26} weight="duotone" className="text-[#0d4f2e]" />, title: 'Zero Fake Listings', desc: 'Every property manually reviewed' },
                { icon: <Lightning size={26} weight="duotone" className="text-[#0d4f2e]" />, title: 'Find in Minutes', desc: 'Advanced filters save your time' },
                { icon: <Users size={26} weight="duotone" className="text-[#0d4f2e]" />, title: 'Verified Landlords', desc: 'All landlords ID-verified' },
                { icon: <Heart size={26} weight="duotone" className="text-[#0d4f2e]" />, title: 'Rwanda First', desc: 'Built specifically for Kigali renters' },
              ].map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-green-100 bg-white p-6 hover:bg-[#f0fdf4] transition-all">
                  <div className="w-12 h-12 bg-[#f0fdf4] rounded-2xl flex items-center justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 mt-2">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="section bg-white">
          <div className="container-app">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-10">What Kigali Renters Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: 'I found my apartment in Remera within 2 days. No more calling fake numbers!', who: 'Amina K., Gasabo' },
                { quote: 'As a landlord, I got 3 genuine tenants in my first week. Incredible platform.', who: 'Jean-Paul M., Landlord' },
                { quote: 'Finally a platform that shows real verified houses in Kigali. Game changer!', who: 'Claudine U., Kicukiro' },
              ].map((item) => (
                <div key={item.who} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <Quotes size={22} weight="duotone" className="text-[#16a34a] mb-4" />
                  <p className="text-gray-700 mb-5">&quot;{item.quote}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold">{item.who.charAt(0)}</div>
                    <div><p className="text-sm font-semibold text-gray-900">{item.who}</p><p className="text-xs text-amber-500">★★★★★</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

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
