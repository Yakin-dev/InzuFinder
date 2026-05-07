import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 })
  response.cookies.set('inzu_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })
  return response
}
