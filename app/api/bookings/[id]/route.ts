import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// PUT /api/bookings/[id] — landlord accepts or declines
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.role !== 'LANDLORD' && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { status } = await req.json()

    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { house: true },
    })

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    if (session.role === 'LANDLORD' && booking.house.landlordId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        house: { select: { title: true, location: true } },
        tenant: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({ booking: updated })
  } catch (error) {
    console.error('[UPDATE_BOOKING]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
