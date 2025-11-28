"use client"

const COINS_STORAGE_KEY = "cropdot-coins"
export const USER_ID_STORAGE_KEY = "cropdot-user-id"
const DEFAULT_AUTHENTICATED_COINS = 1

const buildUserKey = (userId: string) => `${COINS_STORAGE_KEY}-${userId}`

const parseStoredCoins = (value: string | null, fallback = 0) => {
  if (!value) return fallback
  const coins = parseInt(value, 10)
  return Number.isFinite(coins) ? coins : fallback
}

/**
 * Get the currently authenticated user's ID from localStorage
 */
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(USER_ID_STORAGE_KEY)
}

/**
 * Build the storage key for the current user or fall back to legacy storage
 */
export function getCoinsStorageKey(userId?: string | null): string {
  if (userId) return buildUserKey(userId)
  return COINS_STORAGE_KEY
}

/**
 * Determine whether a storage key is used for coins
 */
export function isCoinsStorageKey(key: string | null): boolean {
  if (!key) return false
  return key === COINS_STORAGE_KEY || key.startsWith(`${COINS_STORAGE_KEY}-`)
}

/**
 * Get the current coin balance from localStorage
 */
export function getCoins(userId?: string | null): number {
  if (typeof window === "undefined") return 0

  const activeUserId = userId ?? getCurrentUserId()
  const storageKey = getCoinsStorageKey(activeUserId)
  const stored = window.localStorage.getItem(storageKey)

  if (activeUserId) {
    if (stored === null) {
      // Migrate any legacy coins and fall back to 1 free coin for authenticated users
      const legacyCoins = parseStoredCoins(window.localStorage.getItem(COINS_STORAGE_KEY), DEFAULT_AUTHENTICATED_COINS)
      setCoins(legacyCoins, activeUserId)
      if (window.localStorage.getItem(COINS_STORAGE_KEY) !== null) {
        window.localStorage.removeItem(COINS_STORAGE_KEY)
      }
      return legacyCoins
    }

    return parseStoredCoins(stored, DEFAULT_AUTHENTICATED_COINS)
  }

  // Unauthenticated users fall back to any existing legacy balance but default to 0
  if (stored === null) return 0
  return parseStoredCoins(stored, 0)
}

/**
 * Set the coin balance in localStorage
 */
export function setCoins(coins: number, userId?: string | null): void {
  if (typeof window === "undefined") return

  const targetUserId = userId ?? getCurrentUserId()
  const storageKey = getCoinsStorageKey(targetUserId || undefined)

  try {
    window.localStorage.setItem(storageKey, coins.toString())
  } catch (error) {
    console.error("Failed to save coins:", error)
  }
}

/**
 * Add coins to the current balance
 */
export function addCoins(amount: number, userId?: string | null): number {
  const targetUserId = userId ?? getCurrentUserId()
  const current = getCoins(targetUserId)
  const newBalance = current + amount
  setCoins(newBalance, targetUserId)
  return newBalance
}

/**
 * Subtract coins from the current balance
 */
export function subtractCoins(amount: number, userId?: string | null): number {
  const targetUserId = userId ?? getCurrentUserId()
  const current = getCoins(targetUserId)
  const newBalance = Math.max(0, current - amount)
  setCoins(newBalance, targetUserId)
  return newBalance
}

