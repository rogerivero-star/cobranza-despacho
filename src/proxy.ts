import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Allow login page, auth API, and seed API
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/api/auth/login') || 
    pathname.startsWith('/api/auth/seed')
  ) {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Protect all other routes
  if (!session) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
