import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PROTECTED_ROUTES = ['/dashboard', '/admin']
const AUTH_ROUTES = ['/login', '/register']
const ADMIN_ROUTES = ['/admin', '/dashboard/admin']
const LANDLORD_ROUTES = ['/dashboard/landlord']

const intlMiddleware = createMiddleware({
  locales: ['en', 'rw'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
})

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('inzu_token')?.value

  // Run next-intl middleware first for locale detection
  const intlResponse = intlMiddleware(req)
  if (intlResponse) return intlResponse

  // Auth protection logic
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token) {
    const payload = await verifyToken(token)

    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', req.url))
      response.cookies.delete('inzu_token')
      return response
    }

    if (isAuthRoute) {
      if (payload.role === 'ADMIN') return NextResponse.redirect(new URL('/dashboard/admin', req.url))
      if (payload.role === 'LANDLORD') return NextResponse.redirect(new URL('/dashboard/landlord', req.url))
      return NextResponse.redirect(new URL('/houses', req.url))
    }

    if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (LANDLORD_ROUTES.some((r) => pathname.startsWith(r)) && payload.role !== 'LANDLORD' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (payload.role === 'TENANT') {
      const tenantAllowed = ['/dashboard/bookings', '/dashboard/saved', '/dashboard/profile']
      const isTenantAllowed = tenantAllowed.some((r) => pathname.startsWith(r))
      if (pathname.startsWith('/dashboard') && !isTenantAllowed) {
        return NextResponse.redirect(new URL('/houses', req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
