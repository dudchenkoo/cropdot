"use client"

import type { CarouselData } from "./carousel-types"

export interface StoredCarousel {
  id: string
  data: CarouselData
  savedAt: number
}

const STORAGE_KEY = "carousel-generator-saves"

const isQuotaExceeded = (error: unknown) =>
  error instanceof DOMException &&
  (error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error.code === 22 ||
    error.code === 1014)

const getStoredCarousels = (): StoredCarousel[] => {
  if (typeof window === "undefined") return []

  const existing = window.localStorage.getItem(STORAGE_KEY)
  if (!existing) return []

  try {
    const parsed = JSON.parse(existing)
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item.id === "string" && item.data)
    }
  } catch {
    return []
  }

  return []
}

export const loadCarousel = (): StoredCarousel[] => {
  return getStoredCarousels()
}

export const saveCarousel = (data: CarouselData): StoredCarousel => {
  if (typeof window === "undefined") {
    throw new Error("Local storage is not available in this environment.")
  }

  const existing = getStoredCarousels()
  const entry: StoredCarousel = {
    id: `carousel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    data,
    savedAt: Date.now(),
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]))
    return entry
  } catch (error) {
    if (isQuotaExceeded(error)) {
      throw new Error("Storage quota exceeded. Please remove older carousels and try again.")
    }
    throw new Error("Unable to save carousel data.")
  }
}
