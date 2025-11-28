"use client"

const COINS_STORAGE_KEY = "cropdot-coins"

/**
 * Get the current coin balance from localStorage
 */
export function getCoins(): number {
  if (typeof window === "undefined") return 0

  const stored = window.localStorage.getItem(COINS_STORAGE_KEY)
  if (!stored) {
    // Default to 10 coins for new users
    const defaultCoins = 10
    setCoins(defaultCoins)
    return defaultCoins
  }

  try {
    const coins = parseInt(stored, 10)
    return isNaN(coins) ? 0 : coins
  } catch {
    return 0
  }
}

/**
 * Set the coin balance in localStorage
 */
export function setCoins(coins: number): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(COINS_STORAGE_KEY, coins.toString())
  } catch (error) {
    console.error("Failed to save coins:", error)
  }
}

/**
 * Add coins to the current balance
 */
export function addCoins(amount: number): number {
  const current = getCoins()
  const newBalance = current + amount
  setCoins(newBalance)
  return newBalance
}

/**
 * Subtract coins from the current balance
 */
export function subtractCoins(amount: number): number {
  const current = getCoins()
  const newBalance = Math.max(0, current - amount)
  setCoins(newBalance)
  return newBalance
}

