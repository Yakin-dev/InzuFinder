import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

// PUT /api/admin/reports/[id] — resolve a report
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { resolved } = await req.json()

    const report = await prisma.report.update({
      where: { id },
      data: { resolved: Boolean(resolved) },
    })

    return NextResponse.json({ report })
  } catch (error) {
    console.error('[ADMIN_UPDATE_REPORT]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
