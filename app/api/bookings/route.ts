export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { BookingSchema } from '@/lib/validations'

// POST /api/bookings — tenant creates booking
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.role !== 'TENANT') {
      return NextResponse.json({ error: 'Only tenants can make bookings' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = BookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { houseId, message, moveInDate } = parsed.data

    const house = await prisma.house.findUnique({ where: { id: houseId, status: 'APPROVED' } })
    if (!house) return NextResponse.json({ error: 'House not found or not available' }, { status: 404 })

    // Prevent duplicate pending booking
    const existing = await prisma.booking.findFirst({
      where: { tenantId: session.id, houseId, status: 'PENDING' },
    })
    if (existing) {
      return NextResponse.json({ error: 'You already have a pending booking for this house' }, { status: 409 })
    }

    const booking = await prisma.booking.create({
      data: {
        tenantId: session.id,
        houseId,
        message,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
      },
      include: {
        house: { select: { title: true, location: true } },
        tenant: { select: { name: true, email: true, phone: true } },
      },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('[CREATE_BOOKING]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/bookings — tenant sees own bookings OR landlord sees bookings for their houses
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let bookings

    if (session.role === 'TENANT') {
      bookings = await prisma.booking.findMany({
        where: { tenantId: session.id },
        orderBy: { createdAt: 'desc' },
        include: {
          house: { select: { id: true, title: true, location: true, price: true, images: { take: 1 } } },
        },
      })
    } else if (session.role === 'LANDLORD') {
      bookings = await prisma.booking.findMany({
        where: { house: { landlordId: session.id } },
        orderBy: { createdAt: 'desc' },
        include: {
          house: { select: { id: true, title: true, location: true } },
          tenant: { select: { name: true, email: true, phone: true } },
        },
      })
    } else {
      // ADMIN sees all
      bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          house: { select: { id: true, title: true, location: true } },
          tenant: { select: { name: true, email: true } },
        },
      })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('[GET_BOOKINGS]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
