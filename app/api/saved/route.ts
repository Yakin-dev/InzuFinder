export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// GET /api/saved — tenant saved listings
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const saved = await prisma.savedProperty.findMany({
      where: { userId: session.id },
      include: {
        house: {
          include: {
            images: { take: 1 },
            landlord: { select: { name: true, isVerified: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ saved: saved.map((s) => s.house) }, { status: 200 })
  } catch (error) {
    console.error('[GET_SAVED]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/saved — save a house
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const houseId: unknown = body?.houseId
    if (typeof houseId !== 'string' || houseId.length === 0) {
      return NextResponse.json({ error: 'houseId is required' }, { status: 400 })
    }

    const exists = await prisma.savedProperty.findUnique({
      where: { userId_houseId: { userId: session.id, houseId } },
    }).catch(() => null)

    if (exists) {
      return NextResponse.json({ saved: true }, { status: 200 })
    }

    await prisma.savedProperty.create({
      data: { userId: session.id, houseId },
    })

    return NextResponse.json({ saved: true }, { status: 201 })
  } catch (error) {
    console.error('[SAVE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/saved — unsave a house
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const houseId: unknown = body?.houseId
    if (typeof houseId !== 'string' || houseId.length === 0) {
      return NextResponse.json({ error: 'houseId is required' }, { status: 400 })
    }

    await prisma.savedProperty.deleteMany({
      where: { userId: session.id, houseId },
    })

    return NextResponse.json({ saved: false }, { status: 200 })
  } catch (error) {
    console.error('[UNSAVE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

