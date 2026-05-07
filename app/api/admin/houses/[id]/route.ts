export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// PUT /api/admin/houses/[id] — approve, reject, or toggle verified
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { status, verifyLandlord } = await req.json()

    const house = await prisma.house.findUnique({
      where: { id },
      include: { landlord: true },
    })
    if (!house) return NextResponse.json({ error: 'House not found' }, { status: 404 })

    if (status && !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updates: Promise<unknown>[] = []

    if (status) {
      updates.push(prisma.house.update({ where: { id }, data: { status } }))
    }

    if (verifyLandlord !== undefined) {
      updates.push(
        prisma.user.update({
          where: { id: house.landlordId },
          data: { isVerified: verifyLandlord },
        })
      )
    }

    await Promise.all(updates)

    const updated = await prisma.house.findUnique({
      where: { id },
      include: {
        landlord: { select: { name: true, email: true, isVerified: true } },
        images: { take: 1 },
      },
    })

    return NextResponse.json({ house: updated })
  } catch (error) {
    console.error('[ADMIN_UPDATE_HOUSE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
