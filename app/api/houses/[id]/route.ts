import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { HouseSchema } from '@/lib/validations'

// GET /api/houses/[id] — with view count increment + similar listings
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const house = await prisma.house.findUnique({
      where: { id },
      include: {
        images: true,
        landlord: { select: { id: true, name: true, phone: true, isVerified: true, createdAt: true } },
        _count: { select: { bookings: true } },
      },
    })

    if (!house) return NextResponse.json({ error: 'House not found' }, { status: 404 })

    // Only show non-approved listings to their owner or admin
    if (house.status !== 'APPROVED') {
      const session = await getSessionFromRequest(req)
      if (!session || (session.role !== 'ADMIN' && session.id !== house.landlordId)) {
        return NextResponse.json({ error: 'House not found' }, { status: 404 })
      }
    }

    // Increment view count (fire-and-forget)
    prisma.house.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})

    // Fetch similar listings (same district + type, excluding current)
    const similar = await prisma.house.findMany({
      where: {
        status: 'APPROVED',
        id: { not: id },
        OR: [
          { district: house.district, type: house.type },
          { district: house.district },
        ],
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { take: 1 },
        landlord: { select: { name: true, isVerified: true } },
      },
    })

    return NextResponse.json({ house, similar })
  } catch (error) {
    console.error('[GET_HOUSE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/houses/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const house = await prisma.house.findUnique({ where: { id } })
    if (!house) return NextResponse.json({ error: 'House not found' }, { status: 404 })

    if (session.role !== 'ADMIN' && house.landlordId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    // Admin status update — allow changing just the status
    if (session.role === 'ADMIN' && body.status) {
      const updated = await prisma.house.update({
        where: { id },
        data: { status: body.status },
        include: { images: true },
      })
      return NextResponse.json({ house: updated })
    }

    const parsed = HouseSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { ...parsed.data, status: 'PENDING' }
    if (body.size !== undefined) updateData.size = body.size ? parseInt(body.size) : null
    if (body.floor !== undefined) updateData.floor = body.floor ? parseInt(body.floor) : null

    const updated = await prisma.house.update({
      where: { id },
      data: updateData,
      include: { images: true },
    })

    return NextResponse.json({ house: updated })
  } catch (error) {
    console.error('[UPDATE_HOUSE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/houses/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const house = await prisma.house.findUnique({ where: { id } })
    if (!house) return NextResponse.json({ error: 'House not found' }, { status: 404 })

    if (session.role !== 'ADMIN' && house.landlordId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.house.delete({ where: { id } })
    return NextResponse.json({ message: 'House deleted' })
  } catch (error) {
    console.error('[DELETE_HOUSE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
