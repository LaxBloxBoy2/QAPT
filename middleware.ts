import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  // Check if the request is for a protected route
  const isProtectedRoute = !req.nextUrl.pathname.startsWith('/auth/')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/')
  const isPublicFile = req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  
  // If it's a protected route and there's no session, redirect to sign in
  if (isProtectedRoute && !isApiRoute && !isPublicFile && !session) {
    const redirectUrl = new URL('/auth/signin', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access auth pages, redirect to dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth/')) {
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
