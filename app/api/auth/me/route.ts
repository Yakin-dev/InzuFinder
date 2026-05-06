import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/auth/me — get current user
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, role: true, phone: true, bio: true, avatar: true, isVerified: true, createdAt: true },
    })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('[ME]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/auth/me — update profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, bio } = body

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
      },
      select: { id: true, name: true, email: true, role: true, phone: true, bio: true, avatar: true, isVerified: true },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('[UPDATE_PROFILE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
