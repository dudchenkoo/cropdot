import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Only add Google provider if credentials are configured
const providers = []
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

const authOptions = {
  providers: providers.length > 0 ? providers : [],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        token.name = profile.name ?? token.name
        token.email = profile.email ?? token.email
        token.picture = profile.picture ?? token.picture
      }

      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name ?? undefined
        session.user.email = token.email ?? session.user.email ?? undefined
        session.user.image = token.picture ?? session.user.image ?? undefined
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production",
  pages: {
    signIn: "/",
  },
  debug: false,
  trustHost: true,
}

const handler = NextAuth(authOptions)

// Wrap handlers with error handling to always return valid JSON
export async function GET(req: NextRequest) {
  try {
    const response = await handler(req)
    
    // Ensure response is valid - if it's empty or invalid, return null session
    if (!response || response.status === 500) {
      return NextResponse.json({ user: null, expires: null }, { status: 200 })
    }
    
    return response
  } catch (error) {
    console.error("NextAuth GET error:", error)
    // Return a valid JSON response even on error
    return NextResponse.json({ user: null, expires: null }, { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const response = await handler(req)
    
    // Ensure response is valid - if it's empty or invalid, return null session
    if (!response || response.status === 500) {
      return NextResponse.json({ user: null, expires: null }, { status: 200 })
    }
    
    return response
  } catch (error) {
    console.error("NextAuth POST error:", error)
    // Return a valid JSON response even on error
    return NextResponse.json({ user: null, expires: null }, { status: 200 })
  }
}
