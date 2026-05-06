import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// PUT /api/admin/users/[id] — update user role/status (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { role, isDisabled, isVerified } = body

    const updateData: Record<string, unknown> = {}
    if (role && ['TENANT', 'LANDLORD', 'ADMIN'].includes(role)) {
      updateData.role = role
    }
    if (typeof isDisabled === 'boolean') updateData.isDisabled = isDisabled
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, isVerified: true, isDisabled: true },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('[ADMIN_UPDATE_USER]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
