import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 16 "proxy" (formerly middleware).
 * Protects /admin, /host and /profile routes using the custom-backend JWT
 * stored in the `ne_auth_token` cookie. The backend validates the token on
 * every API call; here we only check cookie existence for gating navigation.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('ne_auth_token')?.value

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/host') && !pathname.startsWith('/host/login')) {
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/host/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/profile')) {
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/host/:path*',
    '/profile/:path*',
  ],
}
