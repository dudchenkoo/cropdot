"use client"

import type React from "react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface PageBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function PageBackground({ children, className = "" }: PageBackgroundProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme-aware dot pattern: light dots in dark mode, dark dots in light mode
  const dotColor = theme === "dark" 
    ? `rgba(255, 255, 255, 0.08)` 
    : `rgba(0, 0, 0, 0.03)`

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${className}`}
      style={{
        backgroundImage: mounted 
          ? `radial-gradient(${dotColor} 1px, transparent 1px)`
          : `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {children}
    </div>
  )
}
