import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { ReportSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

// POST /api/reports
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = ReportSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { houseId, reason, details } = parsed.data

    const house = await prisma.house.findUnique({ where: { id: houseId } })
    if (!house) return NextResponse.json({ error: 'House not found' }, { status: 404 })

    const report = await prisma.report.create({
      data: { reporterId: session.id, houseId, reason, details },
    })

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error('[CREATE_REPORT]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
