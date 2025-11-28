"use client"

const AVATAR_SEED_KEY = "cropdot-avatar-seed"

/**
 * Get or create a consistent seed for the user's avatar
 * This ensures the same avatar is shown every time
 */
export function getAvatarSeed(): string {
  if (typeof window === "undefined") return "user"

  const existing = window.localStorage.getItem(AVATAR_SEED_KEY)
  if (existing) {
    return existing
  }

  // Generate a random seed and store it
  const seed = `user-${Math.random().toString(36).substring(2, 15)}`
  window.localStorage.setItem(AVATAR_SEED_KEY, seed)
  return seed
}

/**
 * Generate avatar URL using DiceBear API
 * Using adventurer style for professional look
 */
export function getAvatarUrl(seed?: string): string {
  const avatarSeed = seed || getAvatarSeed()
  // Using DiceBear's adventurer style - clean and professional
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`
}

const USER_EMAIL_KEY = "cropdot-user-email"

/**
 * Get user email from localStorage or return placeholder
 */
export function getUserEmail(): string {
  if (typeof window === "undefined") return "user@example.com"

  const email = window.localStorage.getItem(USER_EMAIL_KEY)
  return email || "user@example.com"
}

/**
 * Set user email in localStorage
 */
export function setUserEmail(email: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USER_EMAIL_KEY, email)
}

