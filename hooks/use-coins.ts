"use client"

import { useState, useEffect } from "react"
import { getCoins, getCurrentUserId, isCoinsStorageKey, USER_ID_STORAGE_KEY } from "@/lib/coins"

/**
 * Hook to get and manage coins in React components
 */
export function useCoins() {
  const [coins, setCoinsState] = useState<number>(0)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize coins from localStorage
    setCoinsState(getCoins())
    setUserId(getCurrentUserId())

    // Listen for storage changes (in case coins are updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (isCoinsStorageKey(e.key) || e.key === USER_ID_STORAGE_KEY) {
        setCoinsState(getCoins())
        setUserId(getCurrentUserId())
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Function to refresh coins from storage
  const refreshCoins = () => {
    setCoinsState(getCoins())
    setUserId(getCurrentUserId())
  }

  return { coins, refreshCoins, isAuthenticated: Boolean(userId) }
}

