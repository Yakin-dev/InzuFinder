import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// GET /api/admin/reports
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { name: true, email: true } },
        house: { select: { id: true, title: true, location: true, status: true } },
      },
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('[ADMIN_GET_REPORTS]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
