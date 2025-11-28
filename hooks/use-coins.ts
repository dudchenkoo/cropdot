"use client"

import { useState, useEffect } from "react"
import { getCoins } from "@/lib/coins"

/**
 * Hook to get and manage coins in React components
 */
export function useCoins() {
  const [coins, setCoinsState] = useState<number>(0)

  useEffect(() => {
    // Initialize coins from localStorage
    setCoinsState(getCoins())

    // Listen for storage changes (in case coins are updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cropdot-coins") {
        setCoinsState(getCoins())
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Function to refresh coins from storage
  const refreshCoins = () => {
    setCoinsState(getCoins())
  }

  return { coins, refreshCoins }
}

