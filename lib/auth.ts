"use client"

import { setUserEmail } from "@/lib/avatar"

const AUTH_KEY = "cropdot-authenticated"
const USER_EMAIL_KEY = "cropdot-user-email"

/**
 * Check if the user is currently authenticated.
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(AUTH_KEY) === "true"
}

/**
 * Mark the user as authenticated and optionally persist their email.
 */
export function authenticate(email?: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(AUTH_KEY, "true")
  if (email) {
    setUserEmail(email)
  }
}

/**
 * Clear authentication state and remove stored user details.
 */
export function clearAuthentication(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(AUTH_KEY)
  window.localStorage.removeItem(USER_EMAIL_KEY)
}
