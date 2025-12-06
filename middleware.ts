import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Temporarily disabled auth check - will be enabled when Google OAuth is configured
export async function middleware(req: NextRequest) {
  // Allow all requests for now
  return NextResponse.next()
}

export const config = {
  // Only run middleware on specific routes to improve performance
  matcher: ["/dashboard/:path*", "/create/:path*"],
}
