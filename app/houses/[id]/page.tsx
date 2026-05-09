export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HouseCard from '@/components/houses/HouseCard'
import BookingForm from './BookingForm'
import HouseDetailClient from './HouseDetailClient'
import { HouseDetailQuickActions } from '@/components/HouseDetailQuickActions'
import { ShareButton } from '@/components/ShareButton'
import { getServerSession } from '@/lib/auth'
import type { Metadata } from 'next'
import {
  Bed, Bathtub, House as HouseIcon, Armchair, MapPin, ShieldCheck, CaretRight,
  Buildings, Ruler
} from '@phosphor-icons/react/dist/ssr'

// Dynamic SEO metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const house = await prisma.house.findUnique({
      where: { id: params.id },
      include: { images: { take: 1 } },
    })
    if (!house) return { title: 'House Not Found - InzuFinder' }

    return {
      title: `${house.title} - ${house.price.toLocaleString()} RWF/mo | InzuFinder`,
      description: house.description.slice(0, 160),
      openGraph: {
        title: house.title,
        description: `${house.price.toLocaleString()} RWF/month in ${house.location}, ${house.district}`,
        images: house.images[0]?.url ? [house.images[0].url] : [],
      },
    }
  } catch {
    return { title: 'InzuFinder Property' }
  }
}

async function getHouse(id: string, session: any) {
  const house = await prisma.house.findUnique({
    where: { id },
    include: {
      images: true,
      landlord: {
        select: { id: true, name: true, phone: true, isVerified: true, createdAt: true },
      },
    },
  })

  if (!house) return null

  // Security check: Only allow access if:
  // 1. Listing is APPROVED (public)
  // 2. User is the landlord of the listing
  // 3. User is ADMIN
  if (house.status !== 'APPROVED') {
    if (!session) return null
    if (session.role !== 'ADMIN' && session.id !== house.landlord.id) {
      return null
    }
  }

  // Increment view count only for public listings
  if (house.status === 'APPROVED') {
    await prisma.house.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})
  }

  return house
}

async function getSimilar(house: { id: string; district: string; type: string }) {
  return prisma.house.findMany({
    where: {
      status: 'APPROVED',
      id: { not: house.id },
      district: house.district,
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1 },
      landlord: { select: { name: true, isVerified: true } },
    },
  })
}

export default async function HouseDetailPage({ params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    const house = await getHouse(params.id, session)
    if (!house) notFound()

    const isLandlord = session?.id === house.landlord.id
    const similar = await getSimilar(house)

  const listingUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://inzufinder.vercel.app'}/houses/${house.id}`
  const landlordPhoneDigits = house.landlord.phone ? house.landlord.phone.replace(/[^\d]/g, '') : null
  const whatsappPhone = landlordPhoneDigits
    ? landlordPhoneDigits.startsWith('250')
      ? landlordPhoneDigits
      : `250${landlordPhoneDigits.replace(/^0+/, '')}`
    : null

  const whatsappMessage = `Muraho, nabonye iyi nzu "${house.title}" iherereye ${house.location}, ${house.district} kuri InzuFinder. Nifuza kumenya niba ikiboneka no kuyisura. Igiciro ni ${house.price.toLocaleString()} RWF/mwezi. Murakoze! ${listingUrl}`

  const whatsappLink = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`
    : null

    return (
      <>
        <Header />
        <main className="bg-gray-50 min-h-screen py-8">
        <div className="container-app">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#0d4f2e] transition-colors">Home</Link>
            <CaretRight size={12} />
            <Link href="/houses" className="hover:text-[#0d4f2e] transition-colors">Properties</Link>
            <CaretRight size={12} />
            <span className="text-gray-900 truncate max-w-[200px]">{house.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <HouseDetailClient images={house.images} title={house.title} type={house.type} furnished={house.furnished} />

              {/* Title & Info */}
              <div className="card p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0d4f2e]/10 text-[#0d4f2e]">
                        {house.district}
                      </span>
                      {house.status === 'APPROVED' && (
                        <span className="badge-verified text-xs">
                          <ShieldCheck size={12} weight="fill" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{house.title}</h1>
                    <div className="flex items-center text-gray-500 text-sm gap-1">
                      <MapPin size={16} weight="fill" className="text-[#16a34a]" />
                      {house.location}, {house.district}
                    </div>
                  </div>
                  <div className="bg-[#0d4f2e]/5 text-[#0d4f2e] px-5 py-3 rounded-xl text-center flex-shrink-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider mb-0.5">Price / Month</span>
                    <span className="text-xl sm:text-2xl font-bold">{house.price.toLocaleString()} RWF</span>
                  </div>
                </div>

                <div className="divider" />

                {/* Amenities overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0d4f2e]/5 flex items-center justify-center">
                      <Bed size={20} weight="duotone" className="text-[#0d4f2e]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Bedrooms</div>
                      <div className="font-semibold text-gray-900">{house.bedrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Bathtub size={20} weight="duotone" className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Bathrooms</div>
                      <div className="font-semibold text-gray-900">{house.bathrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <HouseIcon size={20} weight="duotone" className="text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Type</div>
                      <div className="font-semibold text-gray-900 capitalize">{house.type.toLowerCase()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Armchair size={20} weight="duotone" className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Furnished</div>
                      <div className="font-semibold text-gray-900">{house.furnished ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>

                {(house.size || house.floor) && (
                  <div className="flex gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
                    {house.size && (
                      <div className="flex items-center gap-2 text-sm">
                        <Ruler size={16} weight="duotone" className="text-gray-400" />
                        <span className="text-gray-600">{house.size} m²</span>
                      </div>
                    )}
                    {house.floor && (
                      <div className="flex items-center gap-2 text-sm">
                        <Buildings size={16} weight="duotone" className="text-gray-400" />
                        <span className="text-gray-600">Floor {house.floor}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="divider" />

                {/* Description */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
                  <div className="prose prose-green max-w-none text-gray-600">
                    <p className="whitespace-pre-line leading-relaxed">{house.description}</p>
                  </div>
                </div>

                {/* Share & Report */}
                <div className="divider" />
                <div className="flex items-center gap-3">
                  <ShareButton url={listingUrl} />
                </div>
              </div>
            </div>

            {/* Right Column - Booking & Landlord */}
            <div className="space-y-6">
              {/* Landlord Card */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Listed By</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0d4f2e] to-[#16a34a] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {house.landlord.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                      {house.landlord.name}
                      {house.landlord.isVerified && (
                        <ShieldCheck size={16} weight="fill" className="text-[#16a34a]" />
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">Joined {new Date(house.landlord.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Landlord rating placeholder */}
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-400 ml-1">No reviews yet</span>
                </div>

                {session ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-600 mb-1">Contact Number:</p>
                      <p className="font-semibold text-gray-900">{house.landlord.phone || 'Not provided'}</p>
                    </div>
                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary w-full text-sm justify-center bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.486a.75.75 0 00.917.918l4.453-1.495A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.487 0-4.786-.811-6.65-2.183l-.466-.349-3.325 1.116 1.116-3.325-.349-.466A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                        </svg>
                        Contact via WhatsApp
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                    <p className="text-sm text-gray-500 mb-3">Sign in to view landlord contact details</p>
                    <Link href="/login" className="btn-secondary w-full py-2">Sign In</Link>
                  </div>
                )}
              </div>

              <HouseDetailQuickActions houseId={house.id} houseTitle={house.title} />

              {/* Booking Card */}
              <div className="card p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Request to Book</h3>

                {isLandlord ? (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm text-center">
                    This is your own listing. You can view booking requests in your dashboard.
                    <Link href="/dashboard/landlord" className="block mt-2 font-semibold underline">Go to Dashboard</Link>
                  </div>
                ) : session ? (
                  session.role === 'TENANT' ? (
                    <BookingForm houseId={house.id} price={house.price} />
                  ) : (
                    <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-sm text-center">
                      Only users with a TENANT account can send booking requests.
                    </div>
                  )
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-4">You need to be signed in as a tenant to send a booking request.</p>
                    <div className="space-y-3">
                      <Link href="/login" className="btn-primary w-full block text-center">Sign In</Link>
                      <Link href="/register?role=TENANT" className="btn-secondary w-full block text-center">Create Tenant Account</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Similar Listings */}
          {similar.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties in {house.district}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((h, i) => (
                  <div key={h.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <HouseCard house={h} index={i} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        </main>
        <Footer />
      </>
    )
  } catch {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h1>
            <p className="text-gray-600">Please try again in a moment.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }
}
