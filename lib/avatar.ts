import type { Session } from "next-auth"

const DEFAULT_SEED = "user"

/**
 * Generate avatar URL using DiceBear API.
 * Prefers the image provided by the authentication provider.
 */
export function getAvatarUrl(session?: Session | null): string {
  if (session?.user?.image) {
    return session.user.image
  }

  const avatarSeed = session?.user?.email || DEFAULT_SEED
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`
}

/**
 * Get user email from the authenticated session or return a placeholder.
 */
export function getUserEmail(session?: Session | null): string {
  return session?.user?.email || "user@example.com"
}

