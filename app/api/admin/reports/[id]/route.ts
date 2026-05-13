import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// PUT /api/admin/reports/[id] — resolve a report
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, resolved } = body as { status?: string; resolved?: boolean }

    let nextStatus = typeof status === 'string' ? status : undefined
    if (!nextStatus && typeof resolved === 'boolean') {
      nextStatus = resolved ? 'REVIEWED' : 'PENDING'
    }

    const resolvedValue =
      typeof resolved === 'boolean'
        ? resolved
        : nextStatus
          ? nextStatus !== 'PENDING'
          : false

    const report = await prisma.report.update({
      where: { id },
      data: {
        status: nextStatus ?? undefined,
        resolved: resolvedValue,
      },
    })

    return NextResponse.json({ report })
  } catch (error) {
    console.error('[ADMIN_UPDATE_REPORT]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
