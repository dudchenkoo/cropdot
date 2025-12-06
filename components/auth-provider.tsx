"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      // Suppress errors when auth is not fully configured
      onError={(error) => {
        // Only log if it's not a JSON parsing error (expected when auth not configured)
        if (!error.message.includes("JSON") && !error.message.includes("Unexpected end")) {
          console.error("SessionProvider error:", error)
        }
      }}
    >
      {children}
    </SessionProvider>
  )
}
