import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting seed...')

  // Create a landlord user for seed listings
  const hashedPassword = await bcrypt.hash('landlord123', 12)

  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@inzufinder.rw' },
    update: {},
    create: {
      name: 'Jean-Pierre Habimana',
      email: 'landlord@inzufinder.rw',
      password: hashedPassword,
      role: 'LANDLORD',
      phone: '+250788123456',
      isVerified: true,
    },
  })

  // Create a second landlord
  const landlord2 = await prisma.user.upsert({
    where: { email: 'marie@inzufinder.rw' },
    update: {},
    create: {
      name: 'Marie Uwimana',
      email: 'marie@inzufinder.rw',
      password: hashedPassword,
      role: 'LANDLORD',
      phone: '+250788654321',
      isVerified: true,
    },
  })

  // Create an admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@inzufinder.rw' },
    update: {},
    create: {
      name: 'Admin InzuFinder',
      email: 'admin@inzufinder.rw',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+250788000000',
      isVerified: true,
    },
  })

  // Create a tenant user
  const tenantPassword = await bcrypt.hash('tenant123', 12)
  await prisma.user.upsert({
    where: { email: 'tenant@inzufinder.rw' },
    update: {},
    create: {
      name: 'Patrick Nkurunziza',
      email: 'tenant@inzufinder.rw',
      password: tenantPassword,
      role: 'TENANT',
      phone: '+250788111222',
      isVerified: false,
    },
  })

  // 10 realistic Kigali house listings
  const listings = [
    {
      title: 'Modern 3-Bedroom Apartment in Kimihurura',
      description: 'Spacious and modern apartment located in the heart of Kimihurura, one of Kigali\'s most sought-after neighborhoods. The property features an open-plan living area, a fully equipped kitchen with granite countertops, and three well-sized bedrooms, each with en-suite bathrooms. Floor-to-ceiling windows offer stunning views of the surrounding hills. The building has 24-hour security, a gym, and covered parking. Walking distance to restaurants, supermarkets, and the Convention Centre.',
      price: 650000,
      location: 'Kimihurura',
      district: 'Gasabo',
      type: 'APARTMENT' as const,
      bedrooms: 3,
      bathrooms: 3,
      size: 120,
      floor: 4,
      furnished: true,
      isFeatured: true,
      landlordId: landlord.id,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    },
    {
      title: 'Cozy Studio in Remera Near Amahoro Stadium',
      description: 'Perfect for young professionals or students, this cozy studio apartment is located in the vibrant Remera neighborhood, just minutes from Amahoro Stadium and major bus routes. The unit comes fully furnished with a comfortable bed, work desk, and kitchenette. Utilities are included in the rent. Secure compound with gated access and on-site caretaker. Ideal for those who want to be in the center of Kigali\'s urban life.',
      price: 120000,
      location: 'Remera',
      district: 'Gasabo',
      type: 'STUDIO' as const,
      bedrooms: 1,
      bathrooms: 1,
      size: 35,
      floor: 2,
      furnished: true,
      isFeatured: false,
      landlordId: landlord.id,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      ],
    },
    {
      title: 'Elegant Villa with Garden in Nyarutarama',
      description: 'A luxurious 5-bedroom villa in the prestigious Nyarutarama neighborhood. This property boasts a large living room, formal dining area, modern kitchen, and a master suite with walk-in closet. The beautifully landscaped garden includes a gazebo and outdoor entertaining area. Two-car garage, backup generator, water tank, and full-time security. Perfect for diplomats and expatriate families looking for upscale living in Kigali.',
      price: 800000,
      location: 'Nyarutarama',
      district: 'Gasabo',
      type: 'VILLA' as const,
      bedrooms: 5,
      bathrooms: 4,
      size: 300,
      floor: 0,
      furnished: false,
      isFeatured: true,
      landlordId: landlord2.id,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
    },
    {
      title: 'Affordable 2-Bedroom House in Nyamirambo',
      description: 'Well-maintained 2-bedroom house in the culturally rich Nyamirambo neighborhood. Features include a bright living room, separate dining area, and a small courtyard. The house is close to local markets, mosques, churches, and the famous Nyamirambo Women\'s Centre. Public transport is easily accessible. An excellent choice for families looking for an affordable home with authentic Kigali character.',
      price: 80000,
      location: 'Nyamirambo',
      district: 'Nyarugenge',
      type: 'HOUSE' as const,
      bedrooms: 2,
      bathrooms: 1,
      size: 75,
      floor: 0,
      furnished: false,
      isFeatured: false,
      landlordId: landlord.id,
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      ],
    },
    {
      title: 'Brand New Apartment in Kacyiru Business District',
      description: 'Just completed, this modern 2-bedroom apartment in the Kacyiru business district offers the best of urban living. Open-plan kitchen and living area with high-end finishes. Both bedrooms have built-in wardrobes. The building features an elevator, underground parking, and rooftop terrace with panoramic views. Steps away from government offices, banks, and international organizations.',
      price: 450000,
      location: 'Kacyiru',
      district: 'Gasabo',
      type: 'APARTMENT' as const,
      bedrooms: 2,
      bathrooms: 2,
      size: 85,
      floor: 6,
      furnished: false,
      isFeatured: true,
      landlordId: landlord2.id,
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      ],
    },
    {
      title: 'Furnished Studio in Kibagabaga Near Hospital',
      description: 'Conveniently located furnished studio near Kibagabaga Hospital and commercial area. The unit includes a comfortable queen bed, wardrobe, study area, and a compact but well-equipped kitchenette. Shared laundry facilities available in the compound. Quiet and safe neighborhood with easy access to public transportation. Ideal for medical professionals or anyone working in the Kibagabaga area.',
      price: 150000,
      location: 'Kibagabaga',
      district: 'Gasabo',
      type: 'STUDIO' as const,
      bedrooms: 1,
      bathrooms: 1,
      size: 30,
      floor: 1,
      furnished: true,
      isFeatured: false,
      landlordId: landlord.id,
      images: [
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      ],
    },
    {
      title: 'Spacious 4-Bedroom Family Home in Kicukiro',
      description: 'A wonderful family home in the heart of Kicukiro, offering four generous bedrooms, a large living room, separate dining room, and a fully tiled kitchen. The compound includes a garden area, servants\' quarters, and space for two vehicles. Located near schools, healthcare facilities, and shopping centers. The neighborhood is quiet, family-friendly, and well-connected to central Kigali.',
      price: 350000,
      location: 'Kicukiro Centre',
      district: 'Kicukiro',
      type: 'HOUSE' as const,
      bedrooms: 4,
      bathrooms: 3,
      size: 180,
      floor: 0,
      furnished: false,
      isFeatured: false,
      landlordId: landlord2.id,
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      ],
    },
    {
      title: 'Modern 1-Bedroom in Gacuriro Hilltop',
      description: 'Enjoy breathtaking views from this elevated 1-bedroom apartment in the Gacuriro hills. Modern interior with quality finishes, European-style bathroom, and a balcony perfect for morning coffee while watching the sunrise over Kigali. The complex offers communal green spaces, a playground for children, and 24/7 security. Close to Vision City Mall, making shopping and entertainment easily accessible.',
      price: 200000,
      location: 'Gacuriro',
      district: 'Gasabo',
      type: 'APARTMENT' as const,
      bedrooms: 1,
      bathrooms: 1,
      size: 50,
      floor: 3,
      furnished: true,
      isFeatured: false,
      landlordId: landlord.id,
      images: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      ],
    },
    {
      title: 'Executive 3-Bed Townhouse in Gikondo',
      description: 'This executive townhouse in the developing Gikondo area offers excellent value. Three bedrooms upstairs, a guest bathroom downstairs, open-plan kitchen and living area, and a private courtyard with car parking. The property is in a gated community with shared garden and playground. Gikondo\'s rapid development means new shops and services are opening nearby. An excellent investment for comfortable, mid-range living.',
      price: 280000,
      location: 'Gikondo',
      district: 'Kicukiro',
      type: 'HOUSE' as const,
      bedrooms: 3,
      bathrooms: 2,
      size: 140,
      floor: 0,
      furnished: false,
      isFeatured: false,
      landlordId: landlord2.id,
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      ],
    },
    {
      title: 'Luxury Penthouse in Kigali City Tower',
      description: 'The crown jewel of city living — a stunning penthouse apartment atop one of Kigali\'s premier residential towers. Features include floor-to-ceiling windows, a wrap-around terrace, designer kitchen with European appliances, home office, and a master suite with a spa-like bathroom. Premium building amenities include concierge, fitness center, swimming pool, and helipad access. Unmatched 360-degree views of Kigali and the surrounding hills.',
      price: 750000,
      location: 'Nyarugenge CBD',
      district: 'Nyarugenge',
      type: 'APARTMENT' as const,
      bedrooms: 3,
      bathrooms: 3,
      size: 200,
      floor: 15,
      furnished: true,
      isFeatured: true,
      landlordId: landlord.id,
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      ],
    },
  ]

  // Create each listing with images
  for (const listing of listings) {
    const { images, ...houseData } = listing

    const existingHouse = await prisma.house.findFirst({
      where: { title: listing.title },
    })

    if (existingHouse) {
      console.log(`  ⏭️  Skipping existing: ${listing.title}`)
      continue
    }

    const house = await prisma.house.create({
      data: {
        ...houseData,
        status: 'APPROVED',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    })

    console.log(`  ✅ Created: ${house.title}`)
  }

  console.log('\n🎉 Seed complete!')
  console.log('\n📋 Test accounts:')
  console.log('   Landlord: landlord@inzufinder.rw / landlord123')
  console.log('   Landlord: marie@inzufinder.rw / landlord123')
  console.log('   Admin:    admin@inzufinder.rw / admin123')
  console.log('   Tenant:   tenant@inzufinder.rw / tenant123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
