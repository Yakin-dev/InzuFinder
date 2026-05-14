import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

type SeedHouse = {
  title: string
  description: string
  price: number
  location: string
  district: 'Gasabo' | 'Kicukiro' | 'Nyarugenge'
  type:
    | 'HOUSE'
    | 'APARTMENT'
    | 'STUDIO'
    | 'ROOM'
    | 'VILLA'
    | 'SHOP'
    | 'OFFICE'
    | 'WAREHOUSE'
    | 'HALL'
    | 'RESTAURANT'
  category: 'RESIDENTIAL' | 'COMMERCIAL'
  availability:
    | 'AVAILABLE'
    | 'VISIT_BOOKED'
    | 'UNDER_NEGOTIATION'
    | 'RENTED'
    | 'UNAVAILABLE'
  furnished: boolean
  bedrooms: number
  bathrooms: number
  size?: number
  floor?: number
  lat: number
  lng: number
  isFeatured?: boolean
  footTraffic?: 'LOW' | 'MEDIUM' | 'HIGH'
  nearMainRoad?: boolean
  hasParking?: boolean
  whatsappNumber?: string
  images: string[]
}

async function main() {
  console.log('🌱 Seeding InzuFinder…')

  // Clear data (order matters due to relations)
  await prisma.savedProperty.deleteMany().catch(() => {})
  await prisma.bookingRequest.deleteMany().catch(() => {})
  await prisma.booking.deleteMany().catch(() => {})
  await prisma.report.deleteMany().catch(() => {})
  await prisma.houseImage.deleteMany().catch(() => {})
  await prisma.house.deleteMany().catch(() => {})

  // Keep existing users if they’re not our demo emails; delete demo users to reseed cleanly
  const demoEmails = [
    'admin@inzufinder.rw',
    'tenant@inzufinder.rw',
    'tenant2@inzufinder.rw',
    'landlord@inzufinder.rw',
    'landlord2@inzufinder.rw',
  ]
  await prisma.user.deleteMany({ where: { email: { in: demoEmails } } }).catch(() => {})

  const landlordPassword = await bcrypt.hash('landlord123', 12)
  const tenantPassword = await bcrypt.hash('tenant123', 12)
  const adminPassword = await bcrypt.hash('admin123', 12)

  const [landlord1, landlord2, admin, tenant1, tenant2] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Jean-Paul Mugenzi',
        email: 'landlord@inzufinder.rw',
        password: landlordPassword,
        role: 'LANDLORD',
        phone: '+250788123456',
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Claudine Uwimana',
        email: 'landlord2@inzufinder.rw',
        password: landlordPassword,
        role: 'LANDLORD',
        phone: '+250788654321',
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'InzuFinder Admin',
        email: 'admin@inzufinder.rw',
        password: adminPassword,
        role: 'ADMIN',
        phone: '+250788000000',
        isVerified: true,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Amina N.',
        email: 'tenant@inzufinder.rw',
        password: tenantPassword,
        role: 'TENANT',
        phone: '+250788111222',
        isVerified: false,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Patrick K.',
        email: 'tenant2@inzufinder.rw',
        password: tenantPassword,
        role: 'TENANT',
        phone: '+250788333444',
        isVerified: false,
        isActive: true,
      },
    }),
  ])

  void admin
  void tenant1
  void tenant2

  const houses: SeedHouse[] = [
    // Residential (14)
    {
      title: 'Modern 3-Bedroom Apartment in Kimihurura',
      description:
        'Modern, sunlit apartment near Kigali Convention Centre. Open-plan living, secure parking, and quick access to Kimihurura’s cafés and offices.',
      price: 650000,
      location: 'Kimihurura',
      district: 'Gasabo',
      type: 'APARTMENT',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: true,
      bedrooms: 3,
      bathrooms: 3,
      size: 120,
      floor: 4,
      lat: -1.9365,
      lng: 30.0847,
      isFeatured: true,
      whatsappNumber: landlord1.phone ?? undefined,
      images: [
        '/houses/house1.jpg',
        '/houses/house2.jpg',
      ],
    },
    {
      title: 'Cozy Studio Apartment in Kacyiru',
      description:
        'Comfortable furnished studio in Kacyiru with easy access to offices, supermarkets, and reliable transport. Ideal for a solo tenant.',
      price: 120000,
      location: 'Kacyiru',
      district: 'Gasabo',
      type: 'STUDIO',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: true,
      bedrooms: 1,
      bathrooms: 1,
      size: 32,
      floor: 2,
      lat: -1.9344,
      lng: 30.0619,
      whatsappNumber: landlord2.phone ?? undefined,
      images: ['/houses/house3.jpg'],
    },
    {
      title: 'Spacious Family House in Remera',
      description:
        'A practical family home in Remera with generous living space and secure compound parking. Close to key routes and services.',
      price: 450000,
      location: 'Remera',
      district: 'Gasabo',
      type: 'HOUSE',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 3,
      bathrooms: 2,
      size: 180,
      floor: 0,
      lat: -1.9551,
      lng: 30.1127,
      isFeatured: true,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house1.jpg'],
    },
    {
      title: 'Luxury Penthouse in Nyarugenge CBD',
      description:
        'Premium city penthouse with sweeping views, refined finishes, and quick access to CBD offices, restaurants, and nightlife.',
      price: 900000,
      location: 'CBD',
      district: 'Nyarugenge',
      type: 'APARTMENT',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: true,
      bedrooms: 3,
      bathrooms: 3,
      size: 200,
      floor: 15,
      lat: -1.9536,
      lng: 30.0606,
      isFeatured: true,
      whatsappNumber: landlord2.phone ?? undefined,
      images: [
        '/houses/house2.jpg',
        '/houses/house3.jpg',
      ],
    },
    {
      title: 'Affordable 2-Bed Apartment in Gacuriro',
      description:
        'Simple and clean 2-bedroom apartment in Gacuriro with calm surroundings and easy access to main roads and shopping.',
      price: 180000,
      location: 'Gacuriro',
      district: 'Gasabo',
      type: 'APARTMENT',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 2,
      bathrooms: 1,
      size: 70,
      floor: 3,
      lat: -1.9162,
      lng: 30.1261,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house1.jpg'],
    },
    {
      title: 'Executive Villa in Nyarutarama',
      description:
        'Executive villa in Nyarutarama with a private garden, ample parking, and strong security. Built for long-term comfort.',
      price: 1200000,
      location: 'Nyarutarama',
      district: 'Gasabo',
      type: 'VILLA',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: true,
      bedrooms: 5,
      bathrooms: 4,
      size: 320,
      floor: 0,
      lat: -1.9281,
      lng: 30.0934,
      isFeatured: true,
      whatsappNumber: landlord2.phone ?? undefined,
      images: [
        '/houses/house2.jpg',
        '/houses/house3.jpg',
      ],
    },
    {
      title: 'Single Room in Nyamirambo',
      description:
        'Affordable room in Nyamirambo near markets and public transport. Great for students and early-career workers.',
      price: 60000,
      location: 'Nyamirambo',
      district: 'Nyarugenge',
      type: 'ROOM',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 1,
      bathrooms: 1,
      size: 16,
      floor: 0,
      lat: -1.9799,
      lng: 30.0378,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house1.jpg'],
    },
    {
      title: '3-Bedroom Townhouse in Gikondo',
      description:
        'Townhouse in Gikondo with reliable access routes and a quiet compound. Balanced choice for families.',
      price: 280000,
      location: 'Gikondo',
      district: 'Kicukiro',
      type: 'HOUSE',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 3,
      bathrooms: 2,
      size: 140,
      floor: 0,
      lat: -1.9741,
      lng: 30.0826,
      whatsappNumber: landlord2.phone ?? undefined,
      images: ['/houses/house2.jpg'],
    },
    {
      title: 'Modern Apartment in Kibagabaga',
      description:
        'Modern furnished apartment near Kibagabaga with quick access to services and a calm residential feel.',
      price: 220000,
      location: 'Kibagabaga',
      district: 'Gasabo',
      type: 'APARTMENT',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: true,
      bedrooms: 2,
      bathrooms: 2,
      size: 78,
      floor: 2,
      lat: -1.9162,
      lng: 30.1089,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house3.jpg'],
    },
    {
      title: 'Budget Room near University of Rwanda',
      description:
        'Budget-friendly room close to central routes and campus access. Clean, safe compound and easy commute.',
      price: 45000,
      location: 'Muhima',
      district: 'Nyarugenge',
      type: 'ROOM',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 1,
      bathrooms: 1,
      size: 14,
      floor: 0,
      lat: -1.965,
      lng: 30.065,
      whatsappNumber: landlord2.phone ?? undefined,
      images: ['/houses/house1.jpg'],
    },
    {
      title: '2-Bedroom Apartment in Kagarama',
      description:
        'Bright 2-bedroom apartment in Kagarama with comfortable layout and a secure compound. Ideal for small families.',
      price: 200000,
      location: 'Kagarama',
      district: 'Kicukiro',
      type: 'APARTMENT',
      category: 'RESIDENTIAL',
      availability: 'VISIT_BOOKED',
      furnished: true,
      bedrooms: 2,
      bathrooms: 1,
      size: 68,
      floor: 1,
      lat: -1.9879,
      lng: 30.0977,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house2.jpg'],
    },
    {
      title: 'Student Studio near INES-Ruhengeri',
      description:
        'Compact studio with efficient layout, good ventilation, and quick access to transport routes. Student-friendly budget.',
      price: 80000,
      location: 'Gikondo',
      district: 'Kicukiro',
      type: 'STUDIO',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: true,
      bedrooms: 1,
      bathrooms: 1,
      size: 28,
      floor: 1,
      lat: -1.97,
      lng: 30.08,
      whatsappNumber: landlord2.phone ?? undefined,
      images: ['/houses/house3.jpg'],
    },
    {
      title: 'Elegant 4-Bed House in Kimironko',
      description:
        'Elegant furnished home near Kimironko with strong access to markets and main routes. Great for a larger household.',
      price: 550000,
      location: 'Kimironko',
      district: 'Gasabo',
      type: 'HOUSE',
      category: 'RESIDENTIAL',
      availability: 'UNDER_NEGOTIATION',
      furnished: true,
      bedrooms: 4,
      bathrooms: 3,
      size: 220,
      floor: 0,
      lat: -1.94,
      lng: 30.12,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house1.jpg'],
    },
    {
      title: 'Furnished Room near Kigali Convention Centre',
      description:
        'Furnished room near central Kigali with quick commute to CBD and Convention Centre. Quiet compound and dependable utilities.',
      price: 90000,
      location: 'CBD',
      district: 'Nyarugenge',
      type: 'ROOM',
      category: 'RESIDENTIAL',
      availability: 'AVAILABLE',
      furnished: true,
      bedrooms: 1,
      bathrooms: 1,
      size: 18,
      floor: 0,
      lat: -1.948,
      lng: 30.059,
      whatsappNumber: landlord2.phone ?? undefined,
      images: ['/houses/house2.jpg'],
    },

    // Commercial (6)
    {
      title: 'Prime Shop Space in Kimironko Market',
      description:
        'High-foot-traffic shop space in Kimironko Market zone. Best for retail, mobile money, fashion, or mini-mart.',
      price: 180000,
      location: 'Kimironko Market',
      district: 'Gasabo',
      type: 'SHOP',
      category: 'COMMERCIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 0,
      bathrooms: 1,
      size: 40,
      floor: 0,
      lat: -1.94,
      lng: 30.12,
      isFeatured: true,
      footTraffic: 'HIGH',
      nearMainRoad: true,
      hasParking: false,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house3.jpg'],
    },
    {
      title: 'Office Space in Kigali Business District',
      description:
        'Professional office space in the Business District with great access, parking, and strong visibility for client visits.',
      price: 450000,
      location: 'Business District',
      district: 'Nyarugenge',
      type: 'OFFICE',
      category: 'COMMERCIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 0,
      bathrooms: 1,
      size: 85,
      floor: 3,
      lat: -1.9536,
      lng: 30.0606,
      footTraffic: 'HIGH',
      hasParking: true,
      whatsappNumber: landlord2.phone ?? undefined,
      images: ['/houses/house1.jpg'],
    },
    {
      title: 'Mini-Supermarket Space in Remera',
      description:
        'Retail space suited for mini-supermarket operations. Good frontage, parking, and quick supply access.',
      price: 250000,
      location: 'Remera',
      district: 'Gasabo',
      type: 'SHOP',
      category: 'COMMERCIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 0,
      bathrooms: 1,
      size: 65,
      floor: 0,
      lat: -1.9551,
      lng: 30.1127,
      footTraffic: 'MEDIUM',
      nearMainRoad: true,
      hasParking: true,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house2.jpg'],
    },
    {
      title: 'Restaurant Space in Nyamirambo',
      description:
        'Restaurant-ready commercial space in Nyamirambo with high foot traffic and strong community demand. Great evening flow.',
      price: 150000,
      location: 'Nyamirambo',
      district: 'Nyarugenge',
      type: 'RESTAURANT',
      category: 'COMMERCIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 0,
      bathrooms: 2,
      size: 90,
      floor: 0,
      lat: -1.9799,
      lng: 30.0378,
      footTraffic: 'HIGH',
      hasParking: false,
      whatsappNumber: landlord2.phone ?? undefined,
      images: ['/houses/house3.jpg'],
    },
    {
      title: 'Event Hall in Gikondo',
      description:
        'Flexible event hall for ceremonies, trainings, and community events. Good access and parking. Secure premises.',
      price: 500000,
      location: 'Gikondo',
      district: 'Kicukiro',
      type: 'HALL',
      category: 'COMMERCIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 0,
      bathrooms: 2,
      size: 260,
      floor: 0,
      lat: -1.9741,
      lng: 30.0826,
      footTraffic: 'MEDIUM',
      hasParking: true,
      whatsappNumber: landlord1.phone ?? undefined,
      images: ['/houses/house1.jpg'],
    },
    {
      title: 'Warehouse in Masoro Industrial Zone',
      description:
        'Warehouse suited for logistics and storage with main-road access and parking for operations. Ideal for SME supply chains.',
      price: 350000,
      location: 'Masoro Industrial Zone',
      district: 'Gasabo',
      type: 'WAREHOUSE',
      category: 'COMMERCIAL',
      availability: 'AVAILABLE',
      furnished: false,
      bedrooms: 0,
      bathrooms: 1,
      size: 400,
      floor: 0,
      lat: -1.89,
      lng: 30.05,
      footTraffic: 'LOW',
      nearMainRoad: true,
      hasParking: true,
      whatsappNumber: landlord2.phone ?? undefined,
      images: ['/houses/house2.jpg'],
    },
  ]

  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  const landlords = [landlord1, landlord2]

  for (let i = 0; i < houses.length; i++) {
    const h = houses[i]
    const landlord = landlords[i % landlords.length]

    await prisma.house.create({
      data: {
        title: h.title,
        description: h.description,
        price: h.price,
        location: h.location,
        district: h.district,
        type: h.type,
        bedrooms: h.bedrooms,
        bathrooms: h.bathrooms,
        furnished: h.furnished,
        status: 'APPROVED',
        landlordId: landlord.id,
        expiresAt,
        isFeatured: Boolean(h.isFeatured),

        category: h.category,
        availability: h.availability,
        size: h.size ? Math.round(h.size) : null,
        floor: typeof h.floor === 'number' ? h.floor : null,
        lat: h.lat,
        lng: h.lng,
        views: 0,
        viewCount: 0,
        whatsappNumber: h.whatsappNumber,
        hasParking: Boolean(h.hasParking),
        nearMainRoad: Boolean(h.nearMainRoad),
        footTraffic: h.footTraffic,

        images: { create: h.images.map((url) => ({ url })) },
      },
    })
  }

  console.log('✅ Seed complete')
  console.log('Demo logins:')
  console.log(' - tenant@inzufinder.rw / tenant123')
  console.log(' - admin@inzufinder.rw / admin123')
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
