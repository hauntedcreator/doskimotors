import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define paths that are protected (require authentication)
  const protectedPaths = [
    '/dealer-dashboard',
    '/dealer-dashboard/',
    '/admin',
    '/admin/'
  ]

  // Check if the path is in the protected paths list
  const isProtectedPath = protectedPaths.some(pp => 
    path === pp || path.startsWith(`${pp}/`)
  )

  // Get the authentication token from cookies
  const token = request.cookies.get('auth_token')?.value

  // If the path is protected and there is no token, redirect to login
  if (isProtectedPath && !token) {
    // Create the URL for the login page with a redirect parameter
    const loginUrl = new URL('/dealer-login', request.url)
    loginUrl.searchParams.set('redirect', path)
    
    // Redirect to login page
    return NextResponse.redirect(loginUrl)
  }

  // If the path is not protected or there is a token, continue with the request
  return NextResponse.next()
}

// Configure matcher for the middleware
export const config = {
  matcher: [
    '/dealer-dashboard/:path*',
    '/admin/:path*',
  ],
} 