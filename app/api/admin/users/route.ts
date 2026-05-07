export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// GET /api/admin/users — list all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isVerified: true,
        isDisabled: true,
        createdAt: true,
        _count: { select: { houses: true, bookings: true } },
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('[ADMIN_GET_USERS]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
