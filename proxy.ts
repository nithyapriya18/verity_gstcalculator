import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { GST_AUTH_COOKIE } from '@/lib/auth'

const PROTECTED_PATHS = ['/gst-calculator']

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const hasAuth = req.cookies.get(GST_AUTH_COOKIE)?.value === '1'
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (isProtected && !hasAuth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

