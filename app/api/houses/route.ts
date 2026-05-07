export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { HouseSchema } from '@/lib/validations'

// GET /api/houses — public listing (approved only) with search + filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const district = searchParams.get('district')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const furnished = searchParams.get('furnished')
    const category = searchParams.get('category')
    const hasParking = searchParams.get('hasParking')
    const nearMainRoad = searchParams.get('nearMainRoad')
    const footTraffic = searchParams.get('footTraffic')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') // newest, price_asc, price_desc
    const status = searchParams.get('status') // admin filter: PENDING, APPROVED, REJECTED
    const landlordFilter = searchParams.get('landlord') // 'me' = my own listings
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    // Admin can filter by specific status; default to APPROVED for public
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      where.status = status
    } else {
      where.status = 'APPROVED'
    }

    // Landlord dashboard: show own listings regardless of status
    if (landlordFilter === 'me') {
      const session = await getSessionFromRequest(req)
      if (session) {
        where.landlordId = session.id
        delete where.status // show all statuses for own listings
      }
    }

    // District filter
    if (district) where.district = { contains: district, mode: 'insensitive' }

    // Property type filter
    if (type) where.type = type

    // Category filter
    if (category && ['RESIDENTIAL', 'COMMERCIAL'].includes(category)) {
      where.category = category
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, number>).gte = parseInt(minPrice)
      if (maxPrice) (where.price as Record<string, number>).lte = parseInt(maxPrice)
    }

    // Bedrooms filter
    if (bedrooms) where.bedrooms = parseInt(bedrooms)

    // Furnished filter
    if (furnished === 'true') where.furnished = true
    if (furnished === 'false') where.furnished = false

    // Commercial/utility filters
    if (hasParking === 'true') where.hasParking = true
    if (hasParking === 'false') where.hasParking = false

    if (nearMainRoad === 'true') where.nearMainRoad = true
    if (nearMainRoad === 'false') where.nearMainRoad = false

    if (footTraffic && ['LOW', 'MEDIUM', 'HIGH'].includes(footTraffic)) {
      where.footTraffic = footTraffic
    }

    // Full-text search across title, location, description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Sorting
    let orderBy: Record<string, string>[] = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
    if (sort === 'price_asc') orderBy = [{ price: 'asc' }]
    else if (sort === 'price_desc') orderBy = [{ price: 'desc' }]
    else if (sort === 'newest') orderBy = [{ createdAt: 'desc' }]

    const [houses, total] = await Promise.all([
      prisma.house.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: { take: 1 },
          landlord: { select: { name: true, isVerified: true } },
          _count: { select: { bookings: true } },
        },
      }),
      prisma.house.count({ where }),
    ])

    return NextResponse.json({
      houses,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('[GET_HOUSES]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/houses — landlord creates listing
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.role !== 'LANDLORD' && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only landlords can create listings' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = HouseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { title, description, price, location, district, type, bedrooms, bathrooms, furnished } = parsed.data
    const images: { url: string; publicId?: string }[] = body.images || []

    const house = await prisma.house.create({
      data: {
        title,
        description,
        price,
        location,
        district,
        type,
        bedrooms,
        bathrooms,
        furnished,
        size: body.size ? parseInt(body.size) : null,
        floor: body.floor ? parseInt(body.floor) : null,
        landlordId: session.id,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        images: {
          create: images.map((img) => ({ url: img.url, publicId: img.publicId })),
        },
      },
      include: { images: true },
    })

    return NextResponse.json({ house }, { status: 201 })
  } catch (error) {
    console.error('[CREATE_HOUSE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
