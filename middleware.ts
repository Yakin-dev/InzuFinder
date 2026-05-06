import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PROTECTED_ROUTES = ['/dashboard', '/admin']
const AUTH_ROUTES = ['/login', '/register']
const ADMIN_ROUTES = ['/admin']
const LANDLORD_ROUTES = ['/dashboard']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('inzu_token')?.value

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (token) {
    const payload = await verifyToken(token)

    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', req.url))
      response.cookies.delete('inzu_token')
      return response
    }

    if (isAuthRoute) {
      if (payload.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', req.url))
      if (payload.role === 'LANDLORD') return NextResponse.redirect(new URL('/dashboard', req.url))
      return NextResponse.redirect(new URL('/houses', req.url))
    }

    if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (LANDLORD_ROUTES.some((r) => pathname.startsWith(r)) && payload.role !== 'LANDLORD' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
}
