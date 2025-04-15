import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function determines if the user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  // For demo purposes, we'll check for a cookie that would be set on login
  const hasAuthCookie = request.cookies.has("auth")

  // In a real application, you would verify the token's validity
  return hasAuthCookie
}

export function middleware(request: NextRequest) {
  // For demo purposes, we'll bypass authentication
  // In a real application, you would check authentication status

  // Uncomment the following code to enable authentication checks
  /*
  // Check if the path starts with /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Check authentication status
    if (!isAuthenticated(request)) {
      // If user is not authorized, redirect to login page
      // with the original path as a query parameter to return after login
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  */

  return NextResponse.next()
}

// Define which paths the middleware applies to
export const config = {
  matcher: ["/dashboard/:path*"],
}
