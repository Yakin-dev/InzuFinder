export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/houses/bulk — fetch multiple approved houses by ids
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ids: unknown = body?.ids
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ houses: [] }, { status: 200 })
    }

    const houses = await prisma.house.findMany({
      where: { id: { in: ids as string[] }, status: 'APPROVED' },
      include: {
        images: { take: 1 },
        landlord: { select: { id: true, name: true, phone: true, isVerified: true, avatar: true } },
      },
    })

    return NextResponse.json({ houses }, { status: 200 })
  } catch (error) {
    console.error('[HOUSES_BULK]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

