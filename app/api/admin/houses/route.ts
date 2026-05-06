import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// GET /api/admin/houses — all houses with any status
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const houses = await prisma.house.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { take: 1 },
        landlord: { select: { id: true, name: true, email: true, phone: true, isVerified: true } },
        _count: { select: { bookings: true, reports: true } },
      },
    })

    return NextResponse.json({ houses })
  } catch (error) {
    console.error('[ADMIN_GET_HOUSES]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
